import React from 'react';
import styles from 'src/styles/new/layouts/layout.module.scss';

interface JoinPageLayoutProps {
  children: React.ReactNode;
}

export default function JoinPageLayout({ children }: JoinPageLayoutProps) {
  return (
    <main className={styles['join']}>
      <div className={styles['card']}>{children}</div>
    </main>
  );
}
