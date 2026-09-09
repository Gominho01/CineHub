import { prisma } from './prisma';
import { verifyToken } from './jwt';
import { UnauthorizedError } from './errors';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/** Verifies the `Authorization: Bearer <token>` header and confirms the
 * account still exists — a valid signature alone doesn't prove that (e.g.
 * after the account was deleted), and skipping that check would otherwise
 * surface as a raw DB error on the user's next write instead of a clean
 * "please log in again". */
export async function requireUser(request: Request): Promise<AuthUser> {
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  let userId: string;
  try {
    userId = verifyToken(token).id;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new UnauthorizedError('Your session is no longer valid — please log in again');
  }

  return user;
}
