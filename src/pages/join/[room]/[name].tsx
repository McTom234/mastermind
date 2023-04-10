import {GetServerSideProps, NextPage} from 'next';

export const getServerSideProps: GetServerSideProps<never, { room: string; name: string }> = async ({ params }) => {
  if (!params)
    throw new Error(
      'Join parameters are not set. Go to /join, to start again. If you have no success, submit a bug report at https://github.com/McTom234/mastermind/issues/new.'
    );

  const searchParams = new URLSearchParams();
  searchParams.set('room', params.room);
  searchParams.set('name', params.name);
  return {
    redirect: {
      destination: '/play?' + searchParams.toString(),
      permanent: true,
    },
  };
};

const Page: NextPage = () => {
  return <></>;
}

export default Page;
