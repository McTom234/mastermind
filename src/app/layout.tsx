import React from 'react';
import '../styles/global.scss';
import Providers from './Providers';
import { Nunito } from 'next/font/google';

const font = Nunito({
  subsets: ['latin'],
})

export const metadata = {
  title: 'Mastermind',
  description: 'A multiplayer-online version of the game "Mastermind".',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={font.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
