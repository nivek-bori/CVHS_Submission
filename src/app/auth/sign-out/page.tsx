'use client';

import Loading from '@/components/ui/loading';
import Message from '@/components/ui/message';
import { supabase } from '@/lib/supabase/client';
import { parseError } from '@/lib/util/server_util';
import React, { useEffect, useState } from 'react';

export default function SignOutPage() {
  const [status, setStatus] = useState<{ status: string; message: string }>({ status: 'loading', message: 'Loading...' });
  // 'success' 'error' 'loading'

  useEffect(() => {
    async function exec() {
      const { error: auth_error } = await supabase.auth.signOut();
      if (auth_error) {
        setStatus({ status: 'error', message: await parseError(auth_error.message, auth_error.code) });
        return;
      }

      setStatus({ status: 'success', message: 'Signed out successfully' });
    }
    exec();
  }, [supabase]);

  return (
    <>
      {status.status === 'error' && <Message color={'red'} children={status.message} />}
      {status.status === 'success' && <Message color={'green'} children={status.message} />}
      {status.status === 'loading' && <Loading message={'Loading...'} />}
    </>
  );
}
