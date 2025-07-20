'use client';

import React from 'react';
import { useState, useEffect } from 'react';

import axios from 'axios';

import { SignUpArgs } from '@/types';
import { parseError } from '@/lib/util/server_util';
import Loading from '../ui/loading';
import FloatingMessage from '../ui/floating-message';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AuthenticationSucess from './authentication-success';

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

        setTimeout(() => setStatus({ status: 'success-page', message: '' }), 3000);
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

  if (status.status === 'page_loading') {
    return <Loading message={'Loading...'} />;
  }

  if (status.status === 'success-page') {
    return <AuthenticationSucess header={'Sign up success'}></AuthenticationSucess>;
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
