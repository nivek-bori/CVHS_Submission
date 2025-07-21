'use client';

import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';

import axios from 'axios';

import { SignUpArgs } from '@/types';
import { parseError } from '@/lib/util/server_util';
import Loading from '../ui/loading';
import FloatingMessage from '../ui/floating-message';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AuthenticationSucess from './authentication-success';
import { config } from '@/lib/config';
import { supabase } from '@/lib/supabase/client';

export default function SignUp() {
  const [status, setStatus] = useState<{ status: 'success' | 'success-page' | 'loading' | 'error' | 'page_loading' | 'null'; message: string }>({
    status: 'null',
    message: '',
  });

  // form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // sign up function
  async function signUp(email: string, password: string, name: string) {
    setStatus({ status: 'loading', message: 'Loading...' });

    const reqBody: SignUpArgs = {
      email: email,
      password: password,
      name: name,
    };

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 1000 * 60);

    axios
      .post('http://localhost:3000/api/signup', reqBody, { signal: controller.signal })
      .then(res => {
        setStatus({ status: res.data.status, message: res.data.message });

        setStatus({ status: 'success-page', message: '' });
      })
      .catch(err => {
        // this is an axios error - refer to docuemntation
        if (err.response) {
          console.log('Page /signup signup error: ', err);
          (async () => {
            setStatus({ status: 'error', message: await parseError(err.response.data.message) });
          })();
        } else {
          console.log('Page /signup signup error: ', err);
          (async () => {
            setStatus({ status: 'error', message: await parseError(err.message) });
          })();
        }
      });
  }

  const verifySignUpArgs = (email: string, password: string, name: string) => {
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

    signUp(email, password, name);
  };

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
  
    // create google social auth
    useEffect(() => {
      setStatus({ status: 'page_loading', message: '' });
  
      window.handleGoogleAuthResponse = handleGoogleAuthResponse;
  
      if (window.google?.accounts?.id) {
        // initialize
        if (typeof window.google.accounts.id.initialize === 'function') {
          window.google.accounts.id.initialize({
            client_id: config.google.client_id,
            callback: handleGoogleAuthResponse,
            auto_select: true,
            itp_support: true,
          });
        }
        // select user account
        if (typeof window.google.accounts.id.prompt === 'function') {
          window.google.accounts.id.prompt();
        }
        // render button
        const buttonContainer = document.querySelector('.g_id_signup');
        if (buttonContainer && typeof window.google.accounts.id.renderButton === 'function') {
          window.google.accounts.id.renderButton(buttonContainer as HTMLElement, {
            type: 'standard',
            shape: 'pill',
            theme: 'outline',
            text: 'signup_with',
            size: 'large',
            logo_alignment: 'left',
          });
  
          setStatus({ status: 'null', message: '' });
        } else {
          setStatus({ status: 'error', message: 'There was an issue loading Google sign in. Please try again later if that is an issue' });
        }
      }
      return () => {
        delete window.handleGoogleAuthResponse;
      };
    }, []);

  if (status.status === 'page_loading') {
    return <Loading message={'Loading...'} />;
  }

  if (status.status === 'success-page') {
    return (
      <>
        <FloatingMessage color='blue'>Please confirm your email</FloatingMessage>
        <AuthenticationSucess header={'Sign up success'}></AuthenticationSucess>
      </>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm bg-gray-50">
        {status.status === 'success' && <FloatingMessage color="green">{status.message}</FloatingMessage>}
        {status.status === 'error' && <FloatingMessage color="red">{status.message}</FloatingMessage>}

        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3"
            onSubmit={e => {
              e.preventDefault();
              verifySignUpArgs(email, password, name);
            }}>
            <div>
              <label htmlFor="name" className="mb-[0.2rem] block text-[0.85rem] font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-[0.9rem] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-[0.2rem] block text-[0.85rem] font-medium text-gray-700">
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
              <label htmlFor="password" className="mb-[0.2rem] block text-[0.85rem] font-medium text-gray-700">
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
              className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              disabled={status.status === 'loading'}>
              {status.status === 'loading' ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div
            id="g_id_onload"
            data-client_id={config.google.client_id}
            data-context="signup"
            data-ux_mode="popup"
            data-callback="handleGoogleAuthResponse"
            data-auto_select="true"
            data-itp_support="true"></div>

          <div
            className="g_id_signup mt-4"
            data-type="standard"
            data-shape="pill"
            data-theme="outline"
            data-text="signup_with"
            data-size="large"
            data-logo_alignment="left"></div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
