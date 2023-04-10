import {ComponentType, CSSProperties} from 'react';
import { PinColor } from 'server/models/Pin';
import styles from 'src/styles/Color.module.sass';

type ColorTypes = {
	value?: PinColor,
	onClick?: () => void,
	selectedColor?: PinColor,
	selectable?: boolean,
	classNames?: string,
	style?: CSSProperties
}

const Color: ComponentType<ColorTypes> = (props) => {
	const noSelect = props.selectable !== undefined && !props.selectable;
	if (props.value !== undefined) return (
		<div className={ `${ styles.colorSelectorButton } ${ noSelect ? styles.noSelect : '' } ${ props.classNames ?? '' }` }
		     onClick={ () => { if (!noSelect && props.onClick) props.onClick();} }
		     data-selcted={ props.selectedColor === props.value }
		     style={ { backgroundColor: props.value, ...props.style } } />
	);
	else return <></>;
};

export default Color;
