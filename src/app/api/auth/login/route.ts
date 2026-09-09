import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/api';
import { loginUser } from '@/lib/auth-service';
import { loginBodySchema } from '@/lib/validators/auth';

export async function POST(request: Request) {
  try {
    const body = loginBodySchema.parse(await request.json());
    const result = await loginUser(body.email, body.password);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
