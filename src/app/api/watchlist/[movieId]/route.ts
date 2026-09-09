import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { errorResponse } from '@/lib/api';
import { rateWatchlistItem, removeFromWatchlist } from '@/lib/watchlist-service';
import { updateRatingSchema } from '@/lib/validators/watchlist';

interface RouteParams {
  params: Promise<{ movieId: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await requireUser(request);
    const { movieId } = await params;
    await removeFromWatchlist(user.id, Number(movieId));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await requireUser(request);
    const { movieId } = await params;
    const body = updateRatingSchema.parse(await request.json());
    const item = await rateWatchlistItem(user.id, Number(movieId), body.rating);
    return NextResponse.json(item);
  } catch (err) {
    return errorResponse(err);
  }
}
