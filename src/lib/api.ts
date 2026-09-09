import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './errors';

/** Maps any thrown error to a consistent `{ error: { message } }` JSON
 * response — every route handler funnels its catch block through this so
 * the frontend never has to guess the error shape. */
export function errorResponse(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return NextResponse.json({ error: { message: 'Validation error', details: err.issues } }, { status: 400 });
  }

  if (err instanceof ApiError) {
    return NextResponse.json({ error: { message: err.message } }, { status: err.status });
  }

  console.error(err);
  return NextResponse.json({ error: { message: 'Internal server error' } }, { status: 500 });
}
