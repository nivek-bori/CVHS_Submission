'use client';

import { Suspense } from 'react';
import AdditionalAuth from '@/components/auth/additional-auth';
import EnforceMFA from '@/components/auth/mfa/enforce-mfa';
import FloatingMessage from '@/components/ui/floating-message';
import Message from '@/components/ui/message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import AuthenticationSuccess from '@/components/auth/authentication-success';

function SignInContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <>
      {message && <FloatingMessage>{message}</FloatingMessage>}
      <EnforceMFA className="">
        <div className="h-full w-full">
          <AuthenticationSuccess header="Signed In" />
        </div>
      </EnforceMFA>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
