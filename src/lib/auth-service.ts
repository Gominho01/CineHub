import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { signToken } from './jwt';
import { ConflictError, UnauthorizedError } from './errors';

const SALT_ROUNDS = 10;

export interface AuthResult {
  token: string;
  user: { id: string; email: string; name: string };
}

export async function registerUser(email: string, password: string, name: string): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { email, password: hashedPassword, name } });

  return { token: signToken({ id: user.id }), user: { id: user.id, email: user.email, name: user.name } };
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  return { token: signToken({ id: user.id }), user: { id: user.id, email: user.email, name: user.name } };
}
