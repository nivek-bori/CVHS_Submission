import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CreateUserArgs, CreateUserRet } from '@/types';

// create db user after google sign up
export async function POST(request: Request) {
	// Request parameter verification
	const body = await request.json();
	const { userId, email, name }: CreateUserArgs = body;

	if (!userId || !email) {
		const retBody: CreateUserRet = { status: 'error', message: 'Please provide all required information' };
		return NextResponse.json(retBody, { status: 400 });
	}

	try {
		const dbUser = await prisma.user.create({
			data: {
				id: userId,
				email,
				name
			}
		});

		const retBody: CreateUserRet = { 
			status: 'success', 
			message: 'Successfully signed up with Google'
		};
		return NextResponse.json(retBody, { status: 200 });
	} catch (error: any) {
		console.log('Route: /api/users/create error', error);

		const retBody: CreateUserRet = { status: 'error', message: 'Server error. Please refresh or try again later' };
		return NextResponse.json(retBody, { status: 500 });
	}
}