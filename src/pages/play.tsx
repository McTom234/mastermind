import { currentPublicSlotOfGame } from 'src/components/helpers';
import LoadingScreen from 'src/components/new/LoadingScreen';
import PlayScreen from "src/components/new/PlayScreen";
import RoleSelectionScreen from 'src/components/new/RoleSelectionScreen';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {useEffect, useRef, useState} from 'react';
import { ClientGame } from 'server/models/Game';
import { ClientToServerEvents, Roles, ServerToClientEvents } from 'server/SocketTypes';
import { io, Socket } from 'socket.io-client';

const Play: NextPage = () => {
  const router = useRouter();

  // socket instance
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(io({ autoConnect: false }));

  // game related vars
  const [role, setRole] = useState<Roles>();
  const game = useRef<ClientGame>();

  // client related vars
  const loadingText = useRef('Connecting...');
  const [roleSelection, setRoleSelection] = useState(true);

  function join() {
    if (router.query.room && router.query.name) {
      console.log('conjoin', router.query)
      loadingText.current = 'Waiting for the Server...';
      socketRef.current.emit('join room', String(router.query.room), String(router.query.name));
    }
  }

  socketRef.current.on('connect', () => {
    join();
  });
  socketRef.current.on('room error', () => {
    console.error('server-side room error');
    socketRef.current.disconnect();
    router.push('/join').catch(() => {
      window.location.href = window.location.origin;
    });
  });
  socketRef.current.on('player joined', (name) => {
    if (game.current === undefined) return;
    game.current.playerName = name;
  });
  socketRef.current.on('game data', (gameData) => {
    game.current = gameData;
  });
  socketRef.current.on('role assignment', (role) => {
    console.log('role')
    setRole(role);
  });
  socketRef.current.on('set pin', (pin, color) => {
    if (game.current === undefined) return;
    currentPublicSlotOfGame(game.current)[`pin${pin}`].color = color;
  });
  socketRef.current.on('set feedback', (pin, color) => {
    if (game.current === undefined) return;
    currentPublicSlotOfGame(game.current).feedback[`pin${pin}`].color = color;
  });
  socketRef.current.on('disconnect', () => (loadingText.current = 'Connecting...'));

  // on browser load
  useEffect(() => {
    socketRef.current.connect();
  }, []);
  // useEffect(() => {
  //   if (socketRef.current.connected) {
  //     join();
  //   }
  // }, [join, router.query]);

  if (role && socketRef.current.connected)
    return <PlayScreen game={game} role={role} socket={socketRef.current} />
  if (roleSelection && socketRef.current.connected)
    return <RoleSelectionScreen setRole={(role: Roles) => {
      if (role === Roles.GUESSER || role === Roles.SETTER) {
        setRoleSelection(false);
        socketRef.current.emit('choose role', role);
      }
    }} />
  return <LoadingScreen text={loadingText.current} />
};

export default Play;
