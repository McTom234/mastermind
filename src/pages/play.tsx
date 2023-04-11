import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Board from 'src/components/board';
import ColorSelector from 'src/components/colorSelector';
import { currentPublicSlotOfGame, currentRoundOfGame, pinsDefined } from 'src/components/helpers';
import LoadingScreen from 'src/components/new/LoadingScreen';
import RoleSelector from 'src/components/new/RoleSelector';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ClientGame } from 'server/models/Game';
import { PinColor } from 'server/models/Pin';
import { ClientToServerEvents, Roles, ServerToClientEvents } from 'server/SocketTypes';
import { io, Socket } from 'socket.io-client';
import colorStyles from 'src/styles/Color.module.sass';
import styles from 'src/styles/Play.module.sass';

const Play: NextPage = () => {
  const router = useRouter();

  // socket instance
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(io({ autoConnect: false }));

  // game related vars
  const [role, setRole] = useState<Roles>();
  const [game, setGame] = useState<ClientGame>();
  const hiddenSlot = game ? currentRoundOfGame(game).hiddenSlot : undefined;

  // client related vars
  const loadingText = useRef('Connecting...');
  const [roleSelection, setRoleSelection] = useState(true);
  const [selectedColor, selectColor] = useState<PinColor>();
  const editable = useRef(false);
  const canFinish = useRef(false);

  if (game !== undefined) {
    const slot = currentPublicSlotOfGame(game);

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

  socketRef.current.on('room error', () => {
    console.error('server-side room error');
    socketRef.current.disconnect();
    router.push('/join').catch(() => {
      window.location.href = window.location.origin;
    });
  });
  socketRef.current.on('player joined', (name) => {
    if (game === undefined) return;
    game.playerName = name;
    updateGame();
  });
  socketRef.current.on('game data', (game) => {
    setGame(game);
  });
  socketRef.current.on('role assignment', (role) => {
    setRole(role);
  });
  socketRef.current.on('set pin', (pin, color) => {
    if (game === undefined) return;
    currentPublicSlotOfGame(game)[`pin${pin}`].color = color;
    updateGame();
  });
  socketRef.current.on('set feedback', (pin, color) => {
    if (game === undefined) return;
    currentPublicSlotOfGame(game).feedback[`pin${pin}`].color = color;
    updateGame();
  });

  socketRef.current.on('disconnect', () => (loadingText.current = 'Connecting...'));

  // on browser load
  useEffect(() => {
    socketRef.current.connect();
  }, []);
  useEffect(() => {
    function join() {
      loadingText.current = 'Waiting for the Server...';
      socketRef.current.emit('join room', String(router.query.room), String(router.query.name));
    }

    if (router.query.room !== undefined && router.query.name !== undefined) {
      if (socketRef.current.connected) {
        join();
      } else {
        socketRef.current.on('connect', () => {
          join();
        });
      }
    }
  }, [router.query]);

  function setRoleCallback(role: Roles) {
    if (role === Roles.GUESSER || role === Roles.SETTER) {
      setRoleSelection(false);
      socketRef.current.emit('choose role', role);
    }
  }

  function setPinCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    socketRef.current.emit('set pin', pin, selectedColor);
    if (game === undefined) return undefined;
    currentPublicSlotOfGame(game)[`pin${pin}`].color = selectedColor;
    updateGame();
    return selectedColor;
  }

  function setFeedbackCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    if (selectedColor !== 'white' && selectedColor !== 'red') {
      socketRef.current.emit('set feedback', pin, undefined);
      if (game === undefined) return undefined;
      currentPublicSlotOfGame(game).feedback[`pin${pin}`].color = undefined;
      updateGame();
      return undefined;
    }
    socketRef.current.emit('set feedback', pin, selectedColor);
    if (game === undefined) return undefined;
    currentPublicSlotOfGame(game).feedback[`pin${pin}`].color = selectedColor;
    updateGame();
    return selectedColor;
  }

  function setSecretCallback(pin: 1 | 2 | 3 | 4) {
    if (pin < 1 && pin > 4) return undefined;
    socketRef.current.emit('set secret', pin, selectedColor);
    if (!game || !hiddenSlot) return undefined;
    hiddenSlot[`pin${pin}`].color = selectedColor;
    updateGame();
    return selectedColor;
  }

  return (
    <div className={styles.fullHeight}>
      {role && socketRef.current.connected ? (
        <>
          <Board game={game} setSecretCallback={setSecretCallback} setPinCallback={setPinCallback} role={role} setFeedbackCallback={setFeedbackCallback} />
          <ColorSelector
            selectedColor={selectedColor}
            selectColor={selectColor}
            feedbackOnly={!game || (role === 'setter' && currentRoundOfGame(game).hiddenSlot !== undefined && !(hiddenSlot ? hiddenSlot.setPins : false))}
          >
            <FontAwesomeIcon
              className={`${colorStyles.colorSelectorButton} ${styles.confirm} ${
                editable.current ? (canFinish.current ? '' : styles.invalid) : styles.noSelect
              }`}
              icon={faCheckCircle}
              onClick={() => {
                if (canFinish.current) {
                  if (game !== undefined) {
                    if (hiddenSlot) hiddenSlot.setPins = false;
                    currentPublicSlotOfGame(game).setPins = false;
                    currentPublicSlotOfGame(game).setFeedback = false;
                    updateGame();
                  }
                  socketRef.current.emit('finish turn');
                }
              }}
            />
          </ColorSelector>
        </>
      ) : roleSelection && socketRef.current.connected ? (
        <RoleSelector setRole={setRoleCallback} />
      ) : (
        <LoadingScreen text={loadingText.current} />
      )}
    </div>
  );
};

export default Play;