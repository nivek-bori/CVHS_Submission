// GET for getting location information
// POST for creating location

import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAuthorized } from '@/lib/util/utils';
import prisma from '@/lib/prisma';
import { LocationCreateRet, LocationGetRet } from '@/types';

export async function GET(request: Request) {
  // Auth
  const supabase = await createServerSupabaseClient();

  const { data: auth_data, error: auth_error } = await supabase.auth.getUser();
  if (auth_error) {
    const retBody: LocationGetRet = { status: 'error', message: 'Please sign in' };
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!auth_data.user) {
    const retBody: LocationGetRet = { status: 'error', message: 'Please sign in' };
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!isAuthorized(auth_data.user.user_metadata.role, 'user')) {
    const retBody: LocationGetRet = { status: 'error', message: 'You do not have access to this' };
    return NextResponse.json(retBody, { status: 401 });
  }

  try {
    const locations = await prisma.location.findMany({
      include: {
        ratings: true,
      },
    });

    return NextResponse.json({ status: 'success', locations }, { status: 200 });
  } catch (error: any) {
    console.log('Route: /api/location error', error);

    const retBody: LocationGetRet = { status: 'error', message: 'Server error. Please refresh or try again later' };
    return NextResponse.json(retBody, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Auth
  const supabase = await createServerSupabaseClient();

  const { data: auth_data, error: auth_error } = await supabase.auth.getUser();
  if (auth_error) {
    const retBody: LocationCreateRet = { status: 'error', message: 'Please sign in' }
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!auth_data.user) {
    const retBody: LocationCreateRet = { status: 'error', message: 'Please sign in' };
    return NextResponse.json(retBody, { status: 401 });
  }
  if (!isAuthorized(auth_data.user.user_metadata.role, 'todo')) {
    const retBody: LocationCreateRet = { status: 'error', message: 'You do not have access to this' };
    return NextResponse.json(retBody, { status: 401 });
  }

  // Request parameter verification
  const body = await request.json();
  const name = body.name;
  const description = body.description;
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);

  if (!body) {
    const retBody: LocationCreateRet = { status: 'error', message: 'Please provide all required information' };
    return NextResponse.json(retBody, { status: 400 });
  }
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    const retBody: LocationCreateRet = { status: 'error', message: 'Please provide information of correct data type' };
    return NextResponse.json(retBody, { status: 400 });
  }

  try {
    // Create the location using Prisma
    const newLocation = await prisma.location.create({
      data: {
        name,
        description,
        latitude,
        longitude,
      },
    });

    const retBody: LocationCreateRet = {
      status: 'success',
      message: 'Location created successfully',
      locationId: newLocation.id,
    };
    return NextResponse.json(retBody, { status: 200 });
  } catch (error: any) {
    console.log('Route: /api/route name error', error);

    const retBody: LocationCreateRet = { status: 'error', message: 'Server error. Please refresh or try again later' };
    return NextResponse.json(retBody, { status: 500 });
  }
}