import { Socket } from 'socket.io';
import { Slot } from './Slot';

export class Round {
	setter?: Socket = undefined;
	guesser?: Socket = undefined;

	hiddenSlot: Slot = new Slot();
	publicSlots: Slot[] = [new Slot()];

	public setRole (socket: Socket, role: 'setter' | 'guesser'): boolean {
		if (this[role] !== undefined) return socket.id === this[role]!.id;
		this[role] = socket;
		socket.data.role = role;
		return true;
	}

	public removePlayer (socket: Socket) {
		if (this.setter?.id === socket.id) this.setter = undefined;
		else if (this.guesser?.id === socket.id) this.guesser = undefined;

		socket.data.role = undefined;
	}
}
