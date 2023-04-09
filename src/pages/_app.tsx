import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'src/styles/globals.scss';
import { Nunito } from 'next/font/google';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { cn } from 'src/lib/helpers';

const font = Nunito({
  subsets: ['latin'],
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <div className={cn(font.className, 'next-root')}>
      <Head>
        <title>Mastermind</title>
        <meta name="description" content="Famous game mastermind online as multiplayer edition" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}

export default MyApp;
