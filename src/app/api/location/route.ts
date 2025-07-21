// GET for getting location information
// POST for creating location

import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { LocationCreateRet, LocationGetRet } from '@/types';

export async function GET(request: Request) {
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
  if (typeof name !== 'string' || typeof description !== 'string' || Number.isNaN(latitude) || Number.isNaN(longitude)) {
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