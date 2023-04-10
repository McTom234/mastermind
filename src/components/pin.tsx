import {ComponentType} from "react";
import { PinColor } from 'server/models/Pin';
import styles from 'src/styles/Pin.module.sass';
import Color from 'src/components/color';

type PinPropsTypes = {
	onClick: () => PinColor | undefined,
	selectable: boolean,
	initialColor?: PinColor,
	colorStyle?: string
}

const Pin: ComponentType<PinPropsTypes> = (props) => {
	const noSelect = !props.selectable;
	return (
		<div onClick={ () => { if (!noSelect) props.onClick(); } }
		     className={ `${ styles.container } ${ noSelect ? styles.noSelect : '' }` }>
			<Color value={ props.initialColor } selectable={ props.selectable } classNames={ props.colorStyle } />
		</div>
	);
};

export default Pin;
