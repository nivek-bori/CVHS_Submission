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
    <html lang="en" className="h-full w-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full w-full antialiased`}>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <AuthProvider>
          <Navigation></Navigation>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
