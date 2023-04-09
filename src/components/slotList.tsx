import type { NextPage } from 'next';
import { ClientGame } from 'server/models/Game';
import { PinColor } from 'server/models/Pin';
import { Roles } from 'server/SocketTypes';
import styles from 'src/styles/SlotList.module.sass';
import FeedbackSlot from 'src/components/feedbackSlot';
import { currentRoundOfGame } from 'src/components/helpers';

type SlotListPropsTypes = {
  game?: ClientGame;
  role?: Roles;
  setPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined;
  setFeedbackPinCallback: (pin: 1 | 2 | 3 | 4) => PinColor | undefined;
};

const SlotList: NextPage<SlotListPropsTypes> = (props) => {
  if (props.role === Roles.SETTER)
    return (
      <div className={styles.container}>
        {props.game !== undefined &&
          currentRoundOfGame(props.game).publicSlots.map((value, index) => (
            <FeedbackSlot
              key={index}
              slot={value}
              setPinCallback={props.setPinCallback}
              setFeedbackPinCallback={props.setFeedbackPinCallback}
              editable={props.role === Roles.GUESSER}
            />
          ))}
      </div>
    );
  else if (props.role === Roles.GUESSER)
    return (
      <div className={styles.container}>
        {props.game !== undefined &&
          currentRoundOfGame(props.game)
            .publicSlots.reverse()
            .map((value, index) => (
              <FeedbackSlot
                key={index}
                slot={value}
                setPinCallback={props.setPinCallback}
                setFeedbackPinCallback={props.setFeedbackPinCallback}
                editable={props.role === Roles.GUESSER}
              />
            ))}
      </div>
    );
  else return <></>;
};

export default SlotList;
