import { ClientGame } from './models/Game';
import { FeedbackPinColor, PinColor } from './models/Pin';

export type ServerToClientEvents = {
	'room error': () => void
	'player joined': (name: string) => void
	'game data': (data: ClientGame) => void
	'role assignment': (role: Roles) => void
	'set pin': (pin: 1 | 2 | 3 | 4, color: PinColor | undefined) => void
	'set feedback': (pin: 1 | 2 | 3 | 4, color: FeedbackPinColor | undefined) => void
}

export type ClientToServerEvents = {
	'join room': (room: string, name: string) => void
	'choose role': (role: Roles) => void
	'set secret': (pin: 1 | 2 | 3 | 4, color: PinColor | undefined) => void
	'set pin': (pin: 1 | 2 | 3 | 4, color: PinColor | undefined) => void
	'set feedback': (pin: 1 | 2 | 3 | 4, color: FeedbackPinColor | undefined) => void
	'finish turn': () => void
}

export type InterServerEvents = {}

export type SocketData = {
	room: string;
	name: string;
}

export enum Roles {
	SETTER = 'setter',
	GUESSER = 'guesser'
}
