'use client';

import AdditionalAuth from '@/components/auth/additional-auth';
import EnforceMFA from '@/components/auth/mfa/enforce-mfa';
import FloatingMessage from '@/components/ui/floating-message';
import Message from '@/components/ui/message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import AuthenticationSuccess from '@/components/auth/authentication-success';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <>
      {message && <FloatingMessage>{message}</FloatingMessage>}
      <EnforceMFA className=''>
        <AuthenticationSuccess header='Signed In'/>
      </EnforceMFA>
    </>
  );
}
