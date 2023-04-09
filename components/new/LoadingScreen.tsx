import Spinner from 'components/new/atoms/Spinner';
import { ComponentType } from 'react';
import layoutStyles from 'styles/new/layouts/layout.module.scss';
import styles from 'styles/new/components/loading-screen.module.scss';

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen: ComponentType<LoadingScreenProps> = ({ text }) => {
  return (
    <main className={layoutStyles['join']}>
      <div className={styles['container']}>
        <Spinner />
        {text && <h2>{text}</h2>}
      </div>
    </main>
  );
};

export default LoadingScreen;
