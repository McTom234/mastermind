import { Server as IOServer, Socket as SocketPreset } from 'socket.io';
import { Logger } from './Logger';
import { ClientGame, Game } from './models/Game';
import { FeedbackPinColor, PinColor } from './models/Pin';
import { Slot } from './models/Slot';
import { ClientToServerEvents, InterServerEvents, Roles, ServerToClientEvents, SocketData } from './SocketTypes';

export type Socket = SocketPreset<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export type ServerWithEvents = IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export class Server {
	private static instance: Server;
	readonly server: ServerWithEvents;
	private readonly games: Map<String, Game>;

	constructor (serverInst: ServerWithEvents) {
		this.server = serverInst;
		this.games = new Map();
		Logger.getLogger().info('Server instance created...');
	}

	public listener (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
		Logger.getLogger().silly('Client connected', socket.id);

		socket.on('disconnect', () => {
			Logger.getLogger().silly('Client disconnected', socket.id);
			if (socket.data.room) Server.instance.games.get(socket.data.room)?.removePlayer(socket);
		});

		socket.on('join room', (room, name) => {
			if (room === null || room === undefined) {
				Logger.getLogger().error('Socket tried to connected without room in request data.');
				return socket.emit('room error');
			}
			if (socket.rooms.size !== 0) Array.from(socket.rooms).forEach(room => socket.leave(room));

			let game;
			if ((game = Server.instance.games.get(room))) { // rom exists
				if (game.addPlayer(socket)) {
					Server.instance.server.in(room).emit('player joined', name);
					Logger.getLogger().info('Socket joins room', socket.id, room);
					socket.join(room);
					socket.data.room = room;
					socket.data.name = name;

					socket.emit('game data', game.getSanitizedGame(socket));
				} else {
					Logger.getLogger().error('Socket could not join room', socket.id, room);
					socket.emit('room error'); // reject play event
				}
			} else { // room does not exist
				// create room and game - let user choose role
				Logger.getLogger().info('Create room ', room);
				Server.instance.games.set(room, new Game());
				game = Server.instance.games.get(room)!;
				if (!game.addPlayer(socket)) {
					Logger.getLogger().error('Socket could not join room', socket.id, room);
					socket.emit('room error'); // reject play event
					return;
				}
				Logger.getLogger().info('Socket joins room', socket.id, room);
				socket.join(room);
				socket.data.room = room;
				socket.data.name = name;
			}
		});

		socket.on('choose role', (role) => {
			if (socket.rooms.size === 0) return socket.emit('room error');

			const game = Server.instance.games.get(socket.data.room!)!;
			const otherRole = role === 'setter' ? 'guesser' : 'setter';

			if (game.round().setRole(socket, role)) {
				socket.emit('role assignment', role);
				if (game.player1 !== undefined && game.player1.id !== socket.id) game.player1.emit('role assignment', otherRole);
				else if (game.player2 !== undefined && game.player2.id !== socket.id) game.player2.emit('role assignment', otherRole);
			} else {
				if (game.round().setRole(socket, otherRole)) socket.emit('role assignment', otherRole);
				else socket.emit('room error');
			}
		});
	}
}
