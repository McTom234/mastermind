import type { NextPage } from 'next';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { PinColor } from '../server/Pin';
import { ClientToServerEvents, ServerToClientEvents } from '../server/SocketTypes';
import SecretSlot from './secretSlot';
import SlotList from './slotList';
import VisibleContainer from './visibleContainer';
import styles from '../styles/Board.module.sass';
import secretSlotStyles from '../styles/SecretSlot.module.sass';

const Board: NextPage<{ socket: Socket<ServerToClientEvents, ClientToServerEvents>, selectedColor?: PinColor }> = ({
	socket,
	selectedColor
}) => {
	const [setter, setSetter] = useState(false);

	socket.on('role assignment', (role) => setSetter(role === 'setter'));

	return (
		<div className={styles.container}>
			<SlotList />

			<VisibleContainer visible={ setter } className={secretSlotStyles.container}>
				<SecretSlot />
			</VisibleContainer>
		</div>
	);
};

export default Board;
