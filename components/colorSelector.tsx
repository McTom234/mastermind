import type { NextPage } from 'next';
import { PinColor } from '../server/Pin';
import Color from './color';
import styles from '../styles/ColorSelector.module.sass';

const ColorSelector: NextPage<{ selectedColor?: PinColor, selectColor: (color: PinColor) => void, role: 'setter' | 'guesser' | undefined }> = (props) => {
	return (
		<div className={ styles.scrollContainer }>
			<div className={ styles.buttonContainer }>
				<Color value={ 'red' } onClick={ () => props.selectColor('red') } role={ props.role }
				       selectedColor={ props.selectedColor } />
				<Color value={ 'white' } onClick={ () => props.selectColor('white') } role={ props.role }
				       selectedColor={ props.selectedColor } />
				<Color value={ 'green' } onClick={ () => props.selectColor('green') } role={ props.role }
				       selectedColor={ props.selectedColor } />
				<Color value={ 'blue' } onClick={ () => props.selectColor('blue') } role={ props.role }
				       selectedColor={ props.selectedColor } />
				<Color value={ 'black' } onClick={ () => props.selectColor('black') } role={ props.role }
				       selectedColor={ props.selectedColor } />
				<Color value={ 'sandybrown' } onClick={ () => props.selectColor('sandybrown') } role={ props.role }
				       selectedColor={ props.selectedColor } />
				<Color value={ 'yellow' } onClick={ () => props.selectColor('yellow') } role={ props.role }
				       selectedColor={ props.selectedColor } />
				<Color value={ 'purple' } onClick={ () => props.selectColor('purple') } role={ props.role }
				       selectedColor={ props.selectedColor } />
			</div>
		</div>
	);
};

export default ColorSelector;
