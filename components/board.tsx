import type { NextPage } from 'next';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { PinColor } from '../server/Pin';
import { ClientToServerEvents, ServerToClientEvents } from '../server/SocketTypes';
import SecretSlot from './secretSlot';
import SlotList from './slotList';
import VisibleContainer from './visibleContainer';

const Board: NextPage<{ socket: Socket<ServerToClientEvents, ClientToServerEvents>, selectedColor?: PinColor }> = ({
	socket,
	selectedColor
}) => {
	const [setter, setSetter] = useState(false);

	return (
		<div className={ styles.container }>
			<SlotList/>

			<VisibleContainer visible={setter}>
				<SecretSlot/>
			</VisibleContainer>
		</div>
	);
};

export default Board;
