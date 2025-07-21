'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import Message from '@/components/ui/message';
import { supabase } from '@/lib/supabase/client';
import { parseError } from '@/lib/util/server_util';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function ConnectGoogle() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<{ status: 'success' | 'error' | 'null' | 'loading'; message: string }>({ status: 'null', message: '' });

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorCode = searchParams.get('error_code');

    if (errorParam) {
      async function exec() {
        setStatus({ status: 'error', message: await parseError(errorParam, errorCode) });
      }
      exec();
    }

    const fullURL = window.location.href;
    if (fullURL.endsWith('#')) {
      setStatus({ status: 'success', message: 'Successfully connected Google account' });
    }
  }, [searchParams]);

  const handleConnectGoogle = useCallback(async (response: any) => {
    const currentUrl = window.location.origin + window.location.pathname;

    const { data: auth_data, error: auth_error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: currentUrl,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    console.log(auth_data);
    console.log(auth_error);

    if (auth_error) {
      setStatus({ status: 'error', message: await parseError(auth_error.message, auth_error.code) });
      return;
    }

    // setStatus({ status: 'success', message: 'Successfully signed in with Google' });
  }, []);

  if (status.status === 'loading') {
    return <Loading message={'Loading...'}></Loading>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <Card className="flex w-full max-w-sm flex-col items-center justify-center bg-gray-50 p-8 py-4">
        {status.status === 'success' && <Message className="m-4 mb-0" color={'green'} children={status.message} />}
        {status.status === 'error' && <Message className="m-4 mb-0" color={'red'} children={status.message} />}

        <CardHeader>
          <CardTitle className="mb-2 text-center text-2xl">Connect Google Account</CardTitle>
        </CardHeader>
        <CardDescription className="text-md mb-6 text-center text-gray-600">
          Select a Google account you want to connect to this account
        </CardDescription>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-4">
          <button
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onClick={handleConnectGoogle}>
            Connect a Google Account
          </button>

          <span className="mt-4 block text-center text-xs text-gray-500">Note that your Google account name will override your chosen name</span>
        </CardContent>
      </Card>
    </div>
  );
}
