import type { NextPage } from 'next';
import { ClientGame } from '../server/models/Game';
import { PinColor } from '../server/models/Pin';
import { Roles } from '../server/SocketTypes';
import styles from '../styles/SlotList.module.sass';
import FeedbackSlot from './feedbackSlot';
import { currentRoundOfGame } from './helpers';

type SlotListPropsTypes = {
	game?: ClientGame,
	role?: Roles,
	setPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined,
	setFeedbackPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined
}

const SlotList: NextPage<SlotListPropsTypes> = (props) => {
	return (
		<div className={ styles.container }>
			{ props.game !== undefined && currentRoundOfGame(props.game).publicSlots.map((value, index) =>
				<FeedbackSlot key={ index } slot={ value } setPinCallback={ props.setPinCallback }
				              setFeedbackPinCallback={ props.setFeedbackPinCallback }
				              editable={ props.role === Roles.GUESSER } />
			) }
		</div>
	);
};

export default SlotList;
