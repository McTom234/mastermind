import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { ClientGame } from 'server/models/Game';
import { PinColor } from 'server/models/Pin';
import { ClientToServerEvents, Roles, ServerToClientEvents } from 'server/SocketTypes';
import { Socket } from 'socket.io-client';
import Board from 'src/components/board';
import ColorSelector from 'src/components/colorSelector';
import { currentPublicSlotOfGame, currentRoundOfGame, pinsDefined } from 'src/components/helpers';
import colorStyles from 'src/styles/Color.module.sass';
import styles from 'src/styles/Play.module.sass';

interface PlayScreenProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  game: MutableRefObject<ClientGame | undefined>;
  role: Roles;
}

const PlayScreen: NextPage<PlayScreenProps> = ({ game, role, socket }) => {
  const [selectedColor, selectColor] = useState<PinColor>();

  const hiddenSlot = game.current ? currentRoundOfGame(game.current).hiddenSlot : undefined;
  const editable = useRef(false);
  const canFinish = useRef(false);

  useEffect(() => {
    if (game.current !== undefined) {
      const slot = currentPublicSlotOfGame(game.current);

      // editable
      if (role === Roles.GUESSER && slot.setPins) editable.current = true;
      else if (role === Roles.SETTER) {
        if (slot.setFeedback) editable.current = true;
        else editable.current = hiddenSlot !== undefined && hiddenSlot.setPins;
      } else editable.current = false;

      // canFinish
      if (role === Roles.GUESSER && slot !== undefined && pinsDefined(slot) && slot.setPins) canFinish.current = true;
      else if (role === Roles.SETTER) {
        if (slot !== undefined && slot.setFeedback) canFinish.current = true;
        else canFinish.current = hiddenSlot !== undefined && pinsDefined(hiddenSlot) && hiddenSlot.setPins;
      } else canFinish.current = false;
    } else {
      editable.current = false;
      canFinish.current = false;
    }
  }, [game, hiddenSlot, role]);

  function setPinCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    socket.emit('set pin', pin, selectedColor);
    if (game.current === undefined) return undefined;
    currentPublicSlotOfGame(game.current)[`pin${pin}`].color = selectedColor;
    return selectedColor;
  }

  function setFeedbackCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    if (selectedColor !== 'white' && selectedColor !== 'red') {
      socket.emit('set feedback', pin, undefined);
      if (game.current === undefined) return undefined;
      currentPublicSlotOfGame(game.current).feedback[`pin${pin}`].color = undefined;
      return undefined;
    }
    socket.emit('set feedback', pin, selectedColor);
    if (game.current === undefined) return undefined;
    currentPublicSlotOfGame(game.current).feedback[`pin${pin}`].color = selectedColor;
    return selectedColor;
  }

  function setSecretCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    socket.emit('set secret', pin, selectedColor);
    if (!game.current || !hiddenSlot) return undefined;
    hiddenSlot[`pin${pin}`].color = selectedColor;
    return selectedColor;
  }

  return (
    <>
      <Board game={game.current} role={role} setSecretCallback={setSecretCallback} setPinCallback={setPinCallback} setFeedbackCallback={setFeedbackCallback} />
      <ColorSelector
        selectedColor={selectedColor}
        selectColor={selectColor}
        feedbackOnly={
          !game.current || (role === 'setter' && currentRoundOfGame(game.current).hiddenSlot !== undefined && !(hiddenSlot ? hiddenSlot.setPins : false))
        }
      >
        <FontAwesomeIcon
          className={`${colorStyles.colorSelectorButton} ${styles.confirm} ${editable.current ? (canFinish.current ? '' : styles.invalid) : styles.noSelect}`}
          icon={faCheckCircle}
          onClick={() => {
            if (canFinish.current) {
              if (game.current !== undefined) {
                if (hiddenSlot) hiddenSlot.setPins = false;
                currentPublicSlotOfGame(game.current).setPins = false;
                currentPublicSlotOfGame(game.current).setFeedback = false;
              }
              socket.emit('finish turn');
            }
          }}
        />
      </ColorSelector>
    </>
  );
};

export default PlayScreen;
