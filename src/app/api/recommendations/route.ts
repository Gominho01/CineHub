import { NextResponse } from 'next/server';
import { getOptionalUser } from '@/lib/auth';
import { errorResponse } from '@/lib/api';
import { getRecommendations } from '@/lib/recommendation-service';

// Personalized when logged in, but still useful for anonymous visitors —
// they just get the popular/highly-rated fallback instead of a genre pick.
export async function GET(request: Request) {
  try {
    const user = await getOptionalUser(request);
    const data = await getRecommendations(user?.id ?? null);
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}
