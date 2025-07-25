import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import prisma from '@/lib/prisma';
import { parseError } from '@/lib/util/server_util';
import { SignUpRet } from '@/types';

/* 
	reference types.ts for the sign in args and ret structures
*/

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email;
  const password = body.password;
  const name = body.name;

  if (!email || !password || !name) {
    const retBody: SignUpRet = { status: 'error', message: 'Not all fields provided: email, password, name' };
    return NextResponse.json(retBody, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  let auth_data_ = null;
  let user_created: boolean = false;

  try {
    // Auth sign up
    const { data: auth_data, error: auth_error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          role: 'user',
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      },
    });

    // Auth errros
    if (auth_error) {
      const retBody: SignUpRet = { status: 'error', message: await parseError(auth_error.message, auth_error.code) };
      return NextResponse.json(retBody, { status: 400 });
    }
    if (!auth_data.user) {
      const retBody: SignUpRet = { status: 'error', message: 'There was an issue signing up. Please try again' };
      return NextResponse.json(retBody, { status: 500 });
    }

    auth_data_ = auth_data;

    // DB sign up
    try {
      const db_data = await prisma.user.upsert({
        where: { id: auth_data.user.id },
        create: {
          id: auth_data.user.id,
          email: email,
          name: name,
        },
          update: {
          name: name,
        },
      });
    } catch (error: any) {
      const retBody: SignUpRet = { status: 'error', message: await parseError(error.message, error.code) };
      return NextResponse.json(retBody, { status: 400 });
    }

    user_created = true;

    const retBody: SignUpRet = { status: 'success', message: `Welcome ${name}. Please confirm your email`, redirectUrl: '/enable-mfa' };
    return NextResponse.json(retBody, { status: 200 });
  } catch (error: any) {
    console.log('Route: /api/signup error error', await parseError(error.message, error.code));

    if (auth_data_?.user && user_created) {
      const supabase = createAdminSupabaseClient();
      await supabase.auth.admin.deleteUser(auth_data_.user.id);
    }

    const retBody: SignUpRet = { status: 'error', message: await parseError(error.message, error.code) };
    return NextResponse.json(retBody, { status: 500 });
  }
}
