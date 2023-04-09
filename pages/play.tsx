import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Board from 'components/board';
import ColorSelector from 'components/colorSelector';
import { currentPublicSlotOfGame, currentRoundOfGame, pinsDefined } from 'components/helpers';
import RoleSelector from 'components/roleSelector';
import { ClientGame } from 'server/models/Game';
import { PinColor } from 'server/models/Pin';
import { ClientToServerEvents, Roles, ServerToClientEvents } from 'server/SocketTypes';
import colorStyles from 'styles/Color.module.sass';
import styles from 'styles/Play.module.sass';

const Play: NextPage = () => {
  const { query } = useRouter();

  // socket instance
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(io({ autoConnect: false }));
  const socket = socketRef.current;

  // game related vars
  const [role, setRole] = useState<Roles>();
  const [game, setGame] = useState<ClientGame>();

  // client related vars
  const [selectedColor, selectColor] = useState<PinColor>();
  let editable = useRef(false);
  let canFinish = useRef(false);

  if (game !== undefined) {
    const slot = currentPublicSlotOfGame(game);
    const hiddenSlot = currentRoundOfGame(game).hiddenSlot;

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

  function updateGame() {
    const g = {};
    Object.assign(g, game);
    setGame(g as ClientGame);
  }

  socket.on('room error', () => {
    console.error('server-side room error');
    socket.disconnect();
    window.location.href = window.location.origin;
  });
  socket.on('player joined', (name) => {
    if (game === undefined) return;
    game.playerName = name;
    updateGame();
  });
  socket.on('game data', (game) => {
    setGame(game);
  });
  socket.on('role assignment', (role) => {
    setRole(role);
  });
  socket.on('set pin', (pin, color) => {
    if (game === undefined) return;
    currentPublicSlotOfGame(game)[`pin${pin}`].color = color;
    updateGame();
  });
  socket.on('set feedback', (pin, color) => {
    if (game === undefined) return;
    currentPublicSlotOfGame(game).feedback[`pin${pin}`].color = color;
    updateGame();
  });

  // on browser load
  useEffect(() => {
    socket.connect();
  }, []);
  useEffect(() => {
    if (query.room !== undefined && query.name !== undefined) socket.on('connect', () => socket.emit('join room', String(query.room), String(query.name)));
  }, [query]);

  function setRoleCallback(role: Roles) {
    if (role === Roles.GUESSER || role === Roles.SETTER) socket.emit('choose role', role);
  }

  function setPinCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    socket.emit('set pin', pin, selectedColor);
    if (game === undefined) return undefined;
    currentPublicSlotOfGame(game)[`pin${pin}`].color = selectedColor;
    updateGame();
    return selectedColor;
  }

  function setFeedbackCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    if (selectedColor !== 'white' && selectedColor !== 'red') {
      socket.emit('set feedback', pin, undefined);
      if (game === undefined) return undefined;
      currentPublicSlotOfGame(game).feedback[`pin${pin}`].color = undefined;
      updateGame();
      return undefined;
    }
    socket.emit('set feedback', pin, selectedColor);
    if (game === undefined) return undefined;
    currentPublicSlotOfGame(game).feedback[`pin${pin}`].color = selectedColor;
    updateGame();
    return selectedColor;
  }

  function setSecretCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    socket.emit('set secret', pin, selectedColor);
    if (game === undefined || currentRoundOfGame(game).hiddenSlot === undefined) return undefined;
    currentRoundOfGame(game).hiddenSlot![`pin${pin}`].color = selectedColor;
    updateGame();
    return selectedColor;
  }

  return (
    <div className={styles.fullHeight}>
      {role ? (
        <>
          <Board game={game} setSecretCallback={setSecretCallback} setPinCallback={setPinCallback} role={role} setFeedbackCallback={setFeedbackCallback} />
          <ColorSelector
            selectedColor={selectedColor}
            selectColor={selectColor}
            feedbackOnly={!game || (role === 'setter' && currentRoundOfGame(game).hiddenSlot !== undefined && !currentRoundOfGame(game).hiddenSlot!.setPins)}
          >
            <FontAwesomeIcon
              className={`${colorStyles.colorSelectorButton} ${styles.confirm} ${
                editable.current ? (canFinish.current ? '' : styles.invalid) : styles.noSelect
              }`}
              icon={faCheckCircle}
              onClick={() => {
                if (canFinish.current) {
                  if (game !== undefined) {
                    if (currentRoundOfGame(game).hiddenSlot !== undefined) currentRoundOfGame(game).hiddenSlot!.setPins = false;
                    currentPublicSlotOfGame(game).setPins = false;
                    currentPublicSlotOfGame(game).setFeedback = false;
                    updateGame();
                  }
                  socket.emit('finish turn');
                }
              }}
            />
          </ColorSelector>
        </>
      ) : (
        <RoleSelector setRole={setRoleCallback} />
      )}
    </div>
  );
};

export default Play;
