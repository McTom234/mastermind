import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp ({
	Component,
	pageProps
}: AppProps) {
	return (
		<div>
			<Head>
				<title>MasterMind online multiplayer</title>
				<meta name="description" content="Famous game mastermind online as multiplayer edition" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Component { ...pageProps } />
		</div>
	);
}

export default MyApp;
