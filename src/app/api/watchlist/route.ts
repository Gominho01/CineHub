import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { errorResponse } from '@/lib/api';
import { addToWatchlist, listWatchlist } from '@/lib/watchlist-service';
import { addWatchlistItemSchema } from '@/lib/validators/watchlist';

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const items = await listWatchlist(user.id);
    return NextResponse.json(items);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = addWatchlistItemSchema.parse(await request.json());
    const item = await addToWatchlist(user.id, body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
