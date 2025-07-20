'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCallback } from 'react';
import AdditionalAuth from './additional-auth';

export default function AuthenticationSucess({ header }: {header: string}) {
  const router = useRouter();
  const handleHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100">
      <Card className="flex-grow-x-1 max-w-md bg-white p-4">
        <CardHeader>
          <CardTitle className="text-center text-3xl">{header}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <button
            onClick={handleHome}
            className="w-80 rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
            Return To Home Page
          </button>
          <AdditionalAuth />
        </CardContent>
      </Card>
    </div>
  );
}
