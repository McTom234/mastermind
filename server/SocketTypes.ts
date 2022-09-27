export type ServerToClientEvents = {
	"room error": () => void
	"player joined": (name: string) => void
	"game data": () => void
	"role assignment": (role: 'setter' | 'guesser') => void
}

export type ClientToServerEvents = {
	"join room": (room: string, name: string) => void
	"choose role": (role: 'setter' | 'guesser') => void
}

export type InterServerEvents = {
}

export type SocketData = {
	room: string;
	name: string;
	role: 'setter' | 'guesser'
}
