// POSt for getting rating
// POST for creating rating

// GET for getting location information
// POST for creating location

import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAuthorized } from '@/lib/util/utils';
import prisma from '@/lib/prisma';
import { RatingCreateRet, RatingGetRet } from '@/types';
import { parseError } from '@/lib/util/server_util';

export async function GET(request: Request) {
  try {
    const ratings = await prisma.rating.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json({ status: 'success', ratings }, { status: 200 });
  } catch (error: any) {
    console.log('Route: /api/Rating error', error);

    const retBody: RatingGetRet = { status: 'error', message: 'Server error. Please refresh or try again later' };
    return NextResponse.json(retBody, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Request parameter verification
  const body = await request.json();
  const userId = typeof body.userId === 'string' ? body.userId : String(body.userId);
  const locationId = typeof body.locationId === 'string' ? body.locationId : String(body.locationId);
  const value = Number(body.rating);
  const description = body.description !== undefined ? String(body.description) : undefined;
  const time = new Date(body.time);
  time.setSeconds(0, 0);

  if (!body) {
    console.error('Please provide all required information');
    const retBody: RatingCreateRet = { status: 'error', message: 'Please provide all required information' };
    return NextResponse.json(retBody, { status: 400 });
  }
  if (
    typeof userId !== 'string' ||
    !userId ||
    typeof locationId !== 'string' ||
    !locationId ||
    Number.isNaN(value) ||
    value < 1 ||
    value > 5 ||
    !(time instanceof Date) ||
    isNaN(time.getTime()) ||
    (description !== undefined && typeof description !== 'string')
  ) {
    console.error('Please provide information of correct data type');
    const retBody: RatingCreateRet = { status: 'error', message: 'Please provide information of correct data type' };
    return NextResponse.json(retBody, { status: 400 });
  }

  try {
    console.log('user id', typeof userId, userId);
    // Create the Rating using Prisma
    const newRating = await prisma.rating.create({
      data: {
        userId: userId,
        locationId,
        value,
        description,
        time,
      },
    });

    const retBody: RatingCreateRet = {
      status: 'success',
      message: 'Rating created successfully',
    };
    return NextResponse.json(retBody, { status: 200 });
  } catch (error: any) {
    console.log('Route: /api/rating error', parseError(error.message, error.code));

    const retBody: RatingCreateRet = { status: 'error', message: 'Server error. Please refresh or try again later' };
    return NextResponse.json(retBody, { status: 500 });
  }
}
