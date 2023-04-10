import JoinPageLayout from 'src/layouts/JoinPageLayout';
import Input from 'src/components/new/atoms/Input';
import Button from 'src/components/new/atoms/Button';
import buttonStyles from 'src/styles/new/components/atoms/button.module.scss';
import inputStyles from 'src/styles/new/components/atoms/input.module.scss';
import { NextPageWithLayout } from 'src/pages/_app';
import {ReactElement, useEffect} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import pen from 'public/icons/pen.svg';

const JoinPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { room } = router.query;
  useEffect(() => {
      router.prefetch('/play').catch(console.warn)
  }, [router])

  return (
    <form action={'/play'}>
      <input type={'hidden'} name={'room'} defaultValue={room} />
      <Input label="Raum" icon={<Link href={`/join`}>
          <Image src={pen} alt={'Raum ändern'} />
      </Link>} defaultValue={room} disabled />
      <Input label="Name" name={'name'} required={true} minLength={1} containerClass={inputStyles['second-input']} autoFocus={true} />
      <div className={buttonStyles['button-row']}>
        <Button type={'submit'}>Namen wählen</Button>
      </div>
    </form>
  );
};

JoinPage.getLayout = (page: ReactElement) => {
  return <JoinPageLayout>{page}</JoinPageLayout>;
};

export default JoinPage;
