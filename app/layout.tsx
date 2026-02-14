import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';

const WalletProvider = dynamic(
  () => import('@/components/WalletProvider').then((mod) => mod.WalletProvider),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Frogger',
  description: 'Classic Frogger arcade game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black flex items-center justify-center">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
