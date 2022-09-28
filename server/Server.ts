import { Server as IOServer, Socket } from 'socket.io';
import { Game } from './Game';
import { Logger } from './Logger';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './SocketTypes';

let server: IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
const games: Map<String, Game> = new Map();

export class Server {
	private static instance: Server;

	public static getInstance (server: IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>): Server {
		if (this.instance === undefined) this.instance = new Server(server);
		return this.instance;
	}

	constructor (serverInst: IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
		server = serverInst;
		Logger.info('Server instance created...')
	}

	public listener (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
		Logger.silly('Client connected', socket.id)

		socket.on('disconnect', () => {
			Logger.silly('Client disconnected', socket.id)
			if (socket.data.room) games.get(socket.data.room)?.removePlayer(socket);
		});
		socket.on('join room', (room, name) => {
			if (room === null || room === undefined) {
				Logger.error('Socket tried to connected without room in request data.')
				return socket.emit('room error');
			}
			if (socket.rooms.size !== 0) Array.from(socket.rooms).forEach(room => socket.leave(room));

			let game;
			if ((game = games.get(room))) { // rom exists
				if (game.addPlayer(socket)) {
					server.in(room).emit('player joined', name);
					Logger.info('Socket joins room', socket.id, room)
					socket.join(room);
					socket.data.room = room;
					socket.data.name = name;

					socket.emit('game data');
				} else {
					Logger.error('Socket could not join room', socket.id, room)
					socket.emit('room error'); // reject play event
				}
			} else { // room does not exist
				// create room and game - let user choose role
				games.set(room, new Game());
				game = games.get(room)!;
				game.addPlayer(socket);
				if (!game.addPlayer(socket)) {
					Logger.error('Socket could not join room', socket.id, room)
					socket.emit('room error'); // reject play event
					return;
				}
				Logger.info('Socket joins room', socket.id, room)
				socket.join(room);
				socket.data.room = room;
				socket.data.name = name;
			}
		});
		socket.on('choose role', (role) => {
			if (socket.rooms.size === 0) return socket.emit('room error');

			const game = games.get(socket.data.room!)!;
			const otherRole = role === 'setter' ? 'guesser' : 'setter';

			if (game.round().setRole(socket, role)) {
				socket.emit('role assignment', role);
				if (game.round()[otherRole] !== undefined) game.round()[otherRole]!.emit('role assignment', otherRole);
			} else {
				if (game.round().setRole(socket, otherRole)) socket.emit('role assignment', otherRole);
				else socket.emit('room error');
			}
		});
	}
}
