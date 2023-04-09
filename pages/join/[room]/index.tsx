import JoinPageLayout from 'layouts/JoinPageLayout';
import Input from 'components/new/Input';
import Button from 'components/new/Button';
import styles from 'styles/new/components/button.module.scss';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import pen from 'public/icons/pen.svg';

function EditLink() {
  return (
    <Link href={`/join`}>
      <Image src={pen} alt={'Raum ändern'} />
    </Link>
  );
}

const JoinPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { room } = router.query;

  return (
    <form action={'/play'}>
      <input type={'hidden'} name={'room'} defaultValue={room} />
      <Input label="Raum" icon={<EditLink />} defaultValue={room} disabled />
      <Input label="Name" name={'name'} containerClass={styles['second-button']} />
      <div className={styles['button-row']}>
        <Button type={'submit'}>Namen wählen</Button>
      </div>
    </form>
  );
};

JoinPage.getLayout = (page: ReactElement) => {
  return <JoinPageLayout>{page}</JoinPageLayout>;
};

export default JoinPage;
