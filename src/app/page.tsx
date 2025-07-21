'use client';

import FloatingMessage from '@/components/ui/floating-message';
import Map from '../components/maps/map';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <>
      {message && <FloatingMessage color="blue">{message}</FloatingMessage>}

      <Map />
    </>
  );
}
