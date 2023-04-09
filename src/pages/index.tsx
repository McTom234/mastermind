import type { NextPage } from 'next';
import Image from 'next/image';
import Description from 'src/components/description';
import styles from 'src/styles/Index.module.sass';
import Link from 'next/link';

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <Description />
      <Link href={'/join'}>Join or start a game now.</Link>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Index;
