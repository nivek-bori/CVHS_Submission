'use client';

import Link from 'next/link';

export default function AdditionalAuth() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="flex w-80 flex-col gap-4 rounded-lg border border-gray-200 bg-white/95 p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Additional Authentication</h2>
        <Link href="/auth/enable-mfa" className="rounded bg-blue-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-700">
          Enable MFA
        </Link>
        <Link href="/auth/connect-google" className="rounded bg-blue-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-700">
          Connect Google Account
        </Link>
      </div>
    </div>
  );
}
