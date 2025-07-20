'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import VerifyMFA from '@/components/auth/mfa/verify-mfa';
import { parseError } from '@/lib/util/server_util';
import SignIn from '@/components/auth/sign-in';
import Loading from '@/components/ui/loading';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import { useAuth } from '@/components/auth/auth-provider';

/* 
	if a facotr is in totp -> it is verified
	if it is in all, then it is either verified or unverified
*/

export default function EnforceMFA({ children, className='' }: Readonly<{ children: React.ReactNode, className: string }>) {
  const router = useRouter();

  const { getUser, version } = useAuth();

  const [status, setStatus] = useState<{ status: 'signin' | 'mfa' | 'authenticated' | 'error' | 'loading'; message: string }>({ status: 'loading', message: '' });

  const checkMFA = useCallback(async () => {
    try {
      const user = await getUser();

      if (!user) {
        setStatus({ status: 'signin', message: 'Please sign in' });
        return;
      }

      const { data: auth_data, error: auth_error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      // Auth error
      if (auth_error) {
        setStatus({ status: 'error', message: await parseError(auth_error.message, auth_error.code) });
        return;
      }
      if (!auth_data || !auth_data.nextLevel || !auth_data.currentLevel) {
        setStatus({ status: 'signin', message: 'Please sign in' });
        return;
      }

      // list mfa factors that user has
      const { data: factors_data, error: factors_error } = await supabase.auth.mfa.listFactors();

      // factor errors
      if (factors_error) {
        setStatus({ status: 'error', message: await parseError(factors_error.message, factors_error.code) });
        return;
      }
      if (!factors_data) {
        setStatus({ status: 'error', message: "There was an issue verifying the user's identity. Please try again later or refresh" });
        return;
      }

      // if totp mfa factors verified -> enforce mfa
      if (factors_data.totp.some(factor => factor.status === 'verified')) {
        // enforce mfa - 'aal1' is caught above
        if (auth_data.nextLevel === 'aal2' && auth_data.nextLevel !== auth_data.currentLevel) {
          setStatus({ status: 'mfa', message: 'Please complete your multi-factor authentication' });
          return;
        }
      }

      setStatus({ status: 'authenticated', message: 'Welcome!' });
    } catch (error: any) {
      console.error('Route example/api/layout error', error);

      if (error && error.message) setStatus({ status: 'error', message: await parseError(error.message) });
      setStatus({ status: 'error', message: 'There was an issue when loading the page. Please try again later or refresh' });
    }
  }, [supabase]);

  useEffect(() => {
    checkMFA();
  }, [checkMFA, version]);

  if (status.status === 'error') {
    router.push(`${config.app.default_route}?message=There was an error opening that page_loading`);
  }
  if (status.status === 'signin') {
    return <SignIn onSignIn={checkMFA} message={'Please sign in first'} />;
  }
  if (status.status === 'mfa') {
    return <VerifyMFA onMFA={checkMFA} />;
  }
  if (status.status === 'authenticated') {
    return <div className={`${className}`}>{children}</div>;
  }

  return <Loading message={'Loading...'} ></Loading>;
}
