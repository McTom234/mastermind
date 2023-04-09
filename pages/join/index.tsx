import JoinPageLayout from 'layouts/JoinPageLayout';
import Input from 'components/new/atoms/Input';
import Button from 'components/new/atoms/Button';
import styles from 'styles/new/components/atoms/button.module.scss';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useRef } from 'react';
import { useRouter } from 'next/router';

const JoinPage: NextPageWithLayout = () => {
  const router = useRouter();
  const roomInput = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Input
        onKeyDown={(event) => {
          if (event.key.toLowerCase() === 'enter') {
            button.current?.click();
          }
        }}
        label="Raum"
        ref={roomInput}
      />
      <div className={styles['button-row']}>
        <Button
          ref={button}
          onClick={() => {
            if (roomInput.current?.value.length === 0) return;

            router.push(router.route + '/' + roomInput.current?.value).catch(console.error);
          }}
        >
          Raum beitreten
        </Button>
      </div>
    </>
  );
};

JoinPage.getLayout = (page: ReactElement) => {
  return <JoinPageLayout>{page}</JoinPageLayout>;
};

export default JoinPage;
