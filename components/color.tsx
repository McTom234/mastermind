import type { NextPage } from 'next';
import { PinColor } from '../server/Pin';
import styles from '../styles/Index.module.css';

const Color: NextPage<{value: PinColor, onClick: () => void}> = ({value, onClick}) => {
	return (
		<div className={ styles.container }>
		</div>
	);
};

export default Color;
