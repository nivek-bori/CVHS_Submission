/* location: /app/signup/page.tsx */
'use client';

import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';

import axios from 'axios';

import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { SignInArgs } from '@/types';
import { parseError } from '@/lib/util/server_util';
import Message from '../ui/message';
import Loading from '../ui/loading';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { config } from '@/lib/config';
import FloatingMessage from '../ui/floating-message';
import { useAuth } from './auth-provider';
const GoogleAuthButton = dynamic(
  () => import('@/components/auth/google-button'),
  { ssr: false },
);

interface SignInParams {
  onSignIn: () => void;
  message?: string;
}

export default function SignIn(params: SignInParams) {
  const router = useRouter();
  const { signIn: signInAuth } = useAuth();

  const [status, setStatus] = useState<{ status: 'success' | 'success-page' | 'error' | 'null' | 'loading' | 'page_loading'; message: string }>({
    status: 'null',
    message: '',
  });

  // form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // sign in function
  async function signIn(email: string, password: string) {
    setStatus({ status: 'loading', message: 'Loading...' });

    if (!email || !password) {
      setStatus({ status: 'error', message: 'Please provide all required information' });
      return;
    }

    try {
      const { error } = await signInAuth(email, password);

      if (error) {
        setStatus({ status: 'error', message: await parseError(error.message) });
        return;
      }

      setStatus({ status: 'success-page', message: '' });
    } catch (error: any) {
      setStatus({ status: 'error', message: 'There was an erorr signing in. Please try again' });
    }
  }

  const verifySignInArgs = (email: string, password: string) => {
    // existance check
    if (!email || !password) {
      setStatus({ status: 'error', message: 'Email and password are required.' });
      return;
    }

    // email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ status: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    // length check
    if (password.length < 6) {
      setStatus({ status: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    // one special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      setStatus({ status: 'error', message: 'Password must contain at least one special character.' });
      return;
    }

    // no special characters
    const forbiddenCharsRegex = /[\s'";\\]/;
    if (forbiddenCharsRegex.test(password)) {
      setStatus({ status: 'error', message: 'Password contains invalid characters.' });
      return;
    }

    signIn(email, password);
  };

  // gogole sign in auth callback
  const handleGoogleAuthResponse = useCallback(async (response: any) => {
    const { data: auth_data, error: auth_error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });

    if (auth_error) {
      setStatus({ status: 'error', message: await parseError(auth_error.message, auth_error.code) });
      return;
    }
    if (!auth_data.user) {
      setStatus({ status: 'error', message: 'There was an issue signing in with Google' });
      return;
    }

    setStatus({ status: 'success', message: 'Successfully signed in with Google' });
  }, []);

  if (status.status === 'page_loading') {
    return <Loading message={'Loading...'}></Loading>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm bg-gray-50">
        {params.message && <FloatingMessage color={'blue'} children={params.message} />}
        {status.status === 'success' && <Message className="m-4 mb-0" color={'green'} children={status.message} />}
        {status.status === 'error' && <Message className="m-4 mb-0" color={'red'} children={status.message} />}

        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={e => {
              e.preventDefault();
              verifySignInArgs(email, password);
            }}>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              disabled={status.status === 'loading'}>
              {status.status === 'loading' ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <GoogleAuthButton handleGoogleAuthCallback={handleGoogleAuthResponse} setStatus={setStatus} buttonText={'signin_with'} buttonContext={'signin'}></GoogleAuthButton>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/auth/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
