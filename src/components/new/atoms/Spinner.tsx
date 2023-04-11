import styles from 'src/styles/new/components/atoms/spinner.module.scss';

const Spinner = () => {
  return (
    <div className={styles['spinner']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
