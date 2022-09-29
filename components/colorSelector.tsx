import type { NextPage } from 'next';
import { PinColor } from '../server/Pin';
import styles from '../styles/Index.module.css';
import Color from './color';

const ColorSelector: NextPage<{ selectedColor: PinColor | undefined, selectColor: (color: PinColor) => void }> = (props) => {
	return (
		<div className={ styles.container }>
			<div>
				<Color value={ 'red' } onClick={ () => props.selectColor('red') } />
				<Color value={ 'green' } onClick={ () => props.selectColor('green') } />
				<Color value={ 'blue' } onClick={ () => props.selectColor('blue') } />
				<Color value={ 'white' } onClick={ () => props.selectColor('white') } />
				<Color value={ 'black' } onClick={ () => props.selectColor('black') } />
				<Color value={ 'sandybrown' } onClick={ () => props.selectColor('sandybrown') } />
				<Color value={ 'yellow' } onClick={ () => props.selectColor('yellow') } />
				<Color value={ 'purple' } onClick={ () => props.selectColor('purple') } />
			</div>
		</div>
	);
};

export default ColorSelector;
