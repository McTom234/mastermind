import type { NextPage } from 'next';
import Image from 'next/image';
import Description from '../components/description';
import Login from '../components/login';
import styles from '../styles/Index.module.sass';

const Index: NextPage = () => {
	return (
		<div className={ styles.container }>
			<Description />
			<Login />

			<footer className={ styles.footer }>
				<a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
				   target="_blank"
				   rel="noopener noreferrer"
				>
					Powered by{ ' ' }
					<span className={ styles.logo }>
                    <Image src="/vercel.svg" alt="Vercel Logo" width={ 72 } height={ 16 } />
                </span>
				</a>
			</footer>
		</div>
	);
};

export default Index;
