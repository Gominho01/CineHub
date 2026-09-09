import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/api';
import { registerUser } from '@/lib/auth-service';
import { registerBodySchema } from '@/lib/validators/auth';

export async function POST(request: Request) {
  try {
    const body = registerBodySchema.parse(await request.json());
    const result = await registerUser(body.email, body.password, body.name);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
