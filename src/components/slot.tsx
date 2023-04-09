import type { NextPage } from 'next';
import { PinColor } from 'server/models/Pin';
import { Slot as SlotModel } from 'server/models/Slot';
import styles from 'src/styles/Slot.module.sass';
import Pin from 'src/components/pin';

type SlotPropsTypes = {
	slot?: SlotModel,
	setPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined,
	className?: string,
	editable: boolean
}

const Slot: NextPage<SlotPropsTypes> = (props) => {
	if (props.slot === undefined) return <></>;

	const editable = props.slot.setPins && props.editable;
	return (
		<div className={ `${ styles.container } ${ props.className ?? '' }` }>
			<Pin onClick={ () => props.setPinCallback(1) } selectable={ editable }
			     initialColor={ props.slot.pin1.color } />
			<Pin onClick={ () => props.setPinCallback(2) } selectable={ editable }
			     initialColor={ props.slot.pin2.color } />
			<Pin onClick={ () => props.setPinCallback(3) } selectable={ editable }
			     initialColor={ props.slot.pin3.color } />
			<Pin onClick={ () => props.setPinCallback(4) } selectable={ editable }
			     initialColor={ props.slot.pin4.color } />
		</div>
	);
};

export default Slot;
