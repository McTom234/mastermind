import type { NextPage } from 'next';
import { ClientGame } from '../server/models/Game';
import { PinColor } from '../server/models/Pin';
import { Roles } from '../server/SocketTypes';
import styles from '../styles/Board.module.sass';
import slotStyles from '../styles/Slot.module.sass';
import { currentRoundOfGame } from './helpers';
import Slot from './slot';
import SlotList from './slotList';
import { cn } from '../lib/helpers';

type BoardPropsTypes = {
  game?: ClientGame;
  role?: Roles;
  setPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined;
  setSecretCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined;
  setFeedbackCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined;
};

const Board: NextPage<BoardPropsTypes> = (props) => {
  return (
    <div className={styles.container}>
      <SlotList game={props.game} role={props.role} setPinCallback={props.setPinCallback} setFeedbackPinCallback={props.setFeedbackCallback} />

      {props.game !== undefined && currentRoundOfGame(props.game).hiddenSlot !== undefined && (
        <Slot
          className={cn(slotStyles.hidden, styles.secretSlotContainer)}
          setPinCallback={props.setSecretCallback}
          slot={props.game !== undefined ? currentRoundOfGame(props.game).hiddenSlot! : undefined}
          editable={props.role === Roles.SETTER}
        />
      )}
    </div>
  );
};

export default Board;
