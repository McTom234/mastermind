import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import pen from 'public/icons/pen.svg';
import { ReactElement } from 'react';
import Button from 'src/components/new/atoms/Button';
import Input from 'src/components/new/atoms/Input';
import JoinPageLayout from 'src/layouts/JoinPageLayout';
import { NextPageWithLayout } from 'src/pages/_app';
import buttonStyles from 'src/styles/new/components/atoms/button.module.scss';
import inputStyles from 'src/styles/new/components/atoms/input.module.scss';

const JoinPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { room } = router.query;
  router.prefetch('/play').catch(console.warn);

  return (
    <form action={'/play'}>
      <input type={'hidden'} name={'room'} defaultValue={room} />
      <Input
        label="Room"
        icon={
          <Link href={`/join`}>
            <Image src={pen} alt={'Change room'} />
          </Link>
        }
        defaultValue={room}
        disabled
      />
      <Input label="Name" name={'name'} required={true} minLength={1} containerClass={inputStyles['second-input']} autoFocus={true} />
      <div className={buttonStyles['button-row']}>
        <Button type={'submit'}>Join room</Button>
      </div>
    </form>
  );
};

JoinPage.getLayout = (page: ReactElement) => {
  return <JoinPageLayout>{page}</JoinPageLayout>;
};

export default JoinPage;
