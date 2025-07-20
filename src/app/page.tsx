'use client';

import FloatingMessage from '@/components/ui/floating-message';
import Navigation from '../components/layout/navbar';
import Map from '../components/maps/map';
import { useSearchParams } from 'next/navigation';
import EnforceMFA from '@/components/auth/mfa/enforce-mfa';

export default function Home() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="flex h-screen w-full flex-col">
      <Navigation />
      <EnforceMFA className="flex-1">
        {message && <FloatingMessage color="blue">{message}</FloatingMessage>}

        <Map />
      </EnforceMFA>
    </div>
  );
}
