import type { NextPage } from 'next';
import { ReactNode } from 'react';
import { PinColor } from 'server/models/Pin';
import styles from 'styles/ColorSelector.module.sass';
import Color from 'components/color';

type ColorSelectorPropsTypes = {
	selectedColor?: PinColor,
	selectColor: (color: PinColor | undefined) => void,
	feedbackOnly?: boolean,
	children: ReactNode
};

const ColorSelector: NextPage<ColorSelectorPropsTypes> = ({
	selectedColor,
	selectColor,
	children,
	feedbackOnly = false
}) => {
	return (
		<div className={ styles.scrollContainer }>
			<div className={ styles.buttonContainer }>
				<Color value={ 'red' } selectedColor={ selectedColor } selectable={ true }
				       onClick={ () => {if (selectedColor === 'red') selectColor(undefined); else selectColor('red');} } />
				<Color value={ 'white' } selectedColor={ selectedColor } selectable={ true }
				       onClick={ () => {if (selectedColor === 'white') selectColor(undefined); else selectColor('white');} } />
				<Color value={ 'green' } selectedColor={ selectedColor } selectable={ true }
				       style={ feedbackOnly ? { display: 'none' } : {} }
				       onClick={ () => {if (selectedColor === 'green') selectColor(undefined); else selectColor('green');} } />
				<Color value={ 'blue' } selectedColor={ selectedColor } selectable={ true }
				       style={ feedbackOnly ? { display: 'none' } : {} }
				       onClick={ () => {if (selectedColor === 'blue') selectColor(undefined); else selectColor('blue');} } />
				<Color value={ 'black' } selectedColor={ selectedColor } selectable={ true }
				       style={ feedbackOnly ? { display: 'none' } : {} }
				       onClick={ () => {if (selectedColor === 'black') selectColor(undefined); else selectColor('black');} } />
				<Color value={ 'sandybrown' } selectedColor={ selectedColor } selectable={ true }
				       style={ feedbackOnly ? { display: 'none' } : {} }
				       onClick={ () => { if (selectedColor === 'sandybrown') selectColor(undefined); else selectColor('sandybrown');} } />
				<Color value={ 'yellow' } selectedColor={ selectedColor } selectable={ true }
				       style={ feedbackOnly ? { display: 'none' } : {} }
				       onClick={ () => {if (selectedColor === 'yellow') selectColor(undefined); else selectColor('yellow');} } />
				<Color value={ 'purple' } selectedColor={ selectedColor } selectable={ true }
				       style={ feedbackOnly ? { display: 'none' } : {} }
				       onClick={ () => {if (selectedColor === 'purple') selectColor(undefined); else selectColor('purple');} } />
				{ children }
			</div>
		</div>
	);
};

export default ColorSelector;
