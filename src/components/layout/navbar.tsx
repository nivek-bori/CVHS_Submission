'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/auth-provider';
import Link from 'next/link';

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = () => router.push('/auth/sign-in');

  const handleSignUp = () => router.push('/auth/sign-up');

  const handleSignOut = () => router.push('/auth/sign-out');

  return (
    <nav className="flex h-20 w-full flex-shrink-0 items-center justify-between border-b-2 border-blue-400 px-6 py-4 shadow">
      <div className="flex items-center space-x-9">
        <div className="text-[1.7rem] font-bold tracking-wide">SafeSpace</div>
        <a href="/" className="rounded border-1 border-blue-200 bg-blue-100 px-[0.7rem] py-[0.2rem] text-base font-semibold text-blue-700 transition">
          Home
        </a>
      </div>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <button
              className="rounded border-1 border-blue-200 bg-blue-100 px-[0.7rem] py-[0.2rem] text-base font-semibold text-blue-700 transition hover:bg-blue-200"
              onClick={handleSignIn}>
              Sign In
            </button>
            <button
              className="rounded border-1 border-blue-200 bg-blue-100 px-[0.7rem] py-[0.2rem] text-base font-semibold text-blue-700 transition hover:bg-blue-200"
              onClick={handleSignUp}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span className="text-base font-semibold text-blue-700">
              {user.user_metadata.name ? (
                <>
                  Welcome back,{' '}
                  <Link
                    className="hover:underline"
                    href={'/auth/additional-auth'}>
                    {user.user_metadata.name}
                  </Link>
                  !
                </>
              ) : ''}
            </span>
            <button
              className="rounded border-1 border-blue-200 bg-blue-100 px-[0.7rem] py-[0.2rem] text-base font-semibold text-blue-700 transition hover:bg-blue-200"
              onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
