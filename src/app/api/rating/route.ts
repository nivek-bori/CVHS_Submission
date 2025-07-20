// POSt for getting rating
// POST for creating rating

// GET for getting location information
// POST for creating location

import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAuthorized } from '@/lib/util/utils';
import prisma from '@/lib/prisma';
import { RatingCreateRet, RatingGetRet } from '@/types';

export async function GET(request: Request) {
  // Auth
  const supabase = await createServerSupabaseClient();

  const { data: auth_data, error: auth_error } = await supabase.auth.getUser();
  if (auth_error) {
    const retBody: RatingGetRet = { status: 'error', message: 'Please sign in' };
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!auth_data.user) {
    const retBody: RatingGetRet = { status: 'error', message: 'Please sign in' };
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!isAuthorized(auth_data.user.user_metadata.role, 'guest')) {
    const retBody: RatingGetRet = { status: 'error', message: 'You do not have access to this' };
    return NextResponse.json(retBody, { status: 401 });
  }

  try {
    const Ratings = await prisma.rating.findMany();

    return NextResponse.json({ status: 'success', Ratings }, { status: 200 });
  } catch (error: any) {
    console.log('Route: /api/Rating error', error);

    const retBody: RatingGetRet = { status: 'error', message: 'Server error. Please refresh or try again later' };
    return NextResponse.json(retBody, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Auth
  const supabase = await createServerSupabaseClient();

  const { data: auth_data, error: auth_error } = await supabase.auth.getUser();
  if (auth_error) {
    const retBody: RatingCreateRet = { status: 'error', message: 'Please sign in' }
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!auth_data.user) {
    const retBody: RatingCreateRet = { status: 'error', message: 'Please sign in' };
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!isAuthorized(auth_data.user.user_metadata.role, 'guest')) {
    const retBody: RatingCreateRet = { status: 'error', message: 'You do not have access to this' };
    return NextResponse.json(retBody, { status: 401 });
  }

  // Request parameter verification
  const body = await request.json();
  const locationId = typeof body.locationId === 'string' ? body.locationId : String(body.locationId);
  const value = Number(body.rating);
  const description = body.description !== undefined ? String(body.description) : undefined;
  const time = new Date(body.time);

  if (!body) {
    const retBody: RatingCreateRet = { status: 'error', message: 'Please provide all required information' };
    return NextResponse.json(retBody, { status: 400 });
  }
  if (
    typeof locationId !== 'string' ||
    !locationId ||
    Number.isNaN(value) ||
    value < 1 || value > 5 ||
    !(time instanceof Date) || isNaN(time.getTime()) ||
    (description !== undefined && typeof description !== 'string')
  ) {
    const retBody: RatingCreateRet = { status: 'error', message: 'Please provide information of correct data type' };
    return NextResponse.json(retBody, { status: 400 });
  }

  try {
    // Create the Rating using Prisma
    const newRating = await prisma.rating.create({
      data: {
        userId: auth_data.user.id,
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
    console.log('Route: /api/rating error', error);

    const retBody: RatingCreateRet = { status: 'error', message: 'Server error. Please refresh or try again later' };
    return NextResponse.json(retBody, { status: 500 });
  }
}