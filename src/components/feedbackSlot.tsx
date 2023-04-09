import type { NextPage } from 'next';
import { PinColor } from 'server/models/Pin';
import { Slot as SlotModel } from 'server/models/Slot';
import styles from 'src/styles/FeedbackSlot.module.sass';
import pinStyles from 'src/styles/Pin.module.sass';
import slotStyles from 'src/styles/Slot.module.sass';
import Pin from 'src/components/pin';
import Slot from 'src/components/slot';

type FeedbackSlotPropsTypes = {
	slot: SlotModel,
	setPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined,
	setFeedbackPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined,
	editable: boolean
}

const FeedbackSlot: NextPage<FeedbackSlotPropsTypes> = (props) => {
	const editable = props.slot.setPins && props.editable;
	const selectable = props.slot.setFeedback && !props.editable;
	return (
		<div className={ styles.container }>
			<Slot slot={ props.slot } setPinCallback={ props.setPinCallback } editable={ editable } />
			<div className={ `${ slotStyles.container } ${ styles.feedbackContainer } ${ pinStyles.feedbackPin }` }>
				<Pin selectable={ selectable } onClick={ () => props.setFeedbackPinCallback(1) }
				     initialColor={ props.slot.feedback.pin1.color } colorStyle={ pinStyles.feedbackColor } />
				<Pin selectable={ selectable } onClick={ () => props.setFeedbackPinCallback(2) }
				     initialColor={ props.slot.feedback.pin2.color } colorStyle={ pinStyles.feedbackColor } />
				<Pin selectable={ selectable } onClick={ () => props.setFeedbackPinCallback(3) }
				     initialColor={ props.slot.feedback.pin3.color } colorStyle={ pinStyles.feedbackColor } />
				<Pin selectable={ selectable } onClick={ () => props.setFeedbackPinCallback(4) }
				     initialColor={ props.slot.feedback.pin4.color } colorStyle={ pinStyles.feedbackColor } />
			</div>
		</div>
	);
};

export default FeedbackSlot;
