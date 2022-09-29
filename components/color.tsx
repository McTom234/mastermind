import type { NextPage } from 'next';
import { PinColor } from '../server/Pin';
import styles from '../styles/Color.module.sass';

const Color: NextPage<{ value: PinColor, onClick: () => void, role?: 'setter' | 'guesser', selectedColor?: PinColor }> = ({
	value,
	role,
	selectedColor,
	onClick
}) => {
	return (
		<button className={ styles.colorSelectorButton }
		        style={ role === 'setter' && value !== 'white' && value !== 'red' ? {
			        display: 'none',
			        backgroundColor: value
		        } : { backgroundColor: value } } onClick={ onClick } data-selcted={ selectedColor === value }></button>
	);
};

export default Color;
