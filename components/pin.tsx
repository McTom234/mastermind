import type { NextPage } from 'next';
import { PinColor } from '../server/models/Pin';
import styles from '../styles/Pin.module.sass';
import Color from './color';

type PinPropsTypes = {
	onClick: () => PinColor | undefined,
	selectable: boolean,
	initialColor?: PinColor
}

const Pin: NextPage<PinPropsTypes> = (props) => {
	const noSelect = !props.selectable;
	return (
		<div onClick={ () => { if (!noSelect) props.onClick(); } }
		     className={ `${ styles.container } ${ noSelect ? styles.noSelect : '' }` }>
			<Color value={ props.initialColor } selectable={ props.selectable } />
		</div>
	);
};

export default Pin;
