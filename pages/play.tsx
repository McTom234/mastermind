import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Board from '../components/board';
import ColorSelector from '../components/colorSelector';
import RoleSelector from '../components/roleSelector';
import VisibleContainer from '../components/visibleContainer';
import { PinColor } from '../server/Pin';
import { ClientToServerEvents, ServerToClientEvents } from '../server/SocketTypes';
import styles from '../styles/Play.module.sass';

const Play: NextPage = () => {
	const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(io({ autoConnect: false }));
	const [role, setRole] = useState<'setter' | 'guesser'>();
	const [selectedColor, selectColor] = useState<PinColor>();

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		if (!(query.get('room') && query.get('name'))) window.location.href = window.location.origin;

		socket.connect();

		socket.on('connect', () => socket.emit('join room', query.get('room')!, query.get('name')!));
		socket.on('room error', () => {
			console.error('server-side room error');
			window.location.href = window.location.origin;
			socket.disconnect();
		});
		socket.on('player joined', (name) => console.log('player joined', name));
		socket.on('game data', () => console.log('game data'));
		socket.on('role assignment', setRole);
	}, []);

	const setRoleFeedback = (role: 'guesser' | 'setter') => {
		if (role === 'guesser' || role === 'setter') socket.emit('choose role', role);
	};

	return (
		<div className={ styles.fullHeight }>
			<VisibleContainer visible={ role === undefined }>
				<RoleSelector setRole={ setRoleFeedback } />
			</VisibleContainer>
			<VisibleContainer visible={ role === 'setter' || role === 'guesser' } className={styles.fullHeight}>
				<Board socket={ socket } selectedColor={ selectedColor } />
				<ColorSelector selectedColor={ selectedColor } selectColor={ selectColor } role={ role } />
			</VisibleContainer>
		</div>
	);
};

export default Play;
