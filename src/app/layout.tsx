import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import Navigation from '@/components/layout/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="max-h-screen w-full">
      <body className={`${geistSans.variable} ${geistMono.variable} flex max-h-full w-full flex-col antialiased`}>
        <AuthProvider>
          <script src="https://accounts.google.com/gsi/client" async defer></script>
          <Navigation></Navigation>
          <div className='flex flex-1'>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
