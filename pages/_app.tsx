import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.scss';

function MyApp ({
	Component,
	pageProps
}: AppProps) {
	return (
		<div className={font.className}>
			<Head>
				<title>MasterMind online multiplayer</title>
				<meta name="description" content="Famous game mastermind online as multiplayer edition" />
			</Head>
			<Component { ...pageProps } />
		</div>
	);
}

export default MyApp;
