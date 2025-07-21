'use client';

import { Suspense } from 'react';
import FloatingMessage from '@/components/ui/floating-message';
import Map from '../components/maps/map';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <>
      {message && <FloatingMessage color="blue">{message}</FloatingMessage>}
      <Map />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
