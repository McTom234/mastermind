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
	readonly games: Map<String, Game>;

	constructor (serverInst: ServerWithEvents) {
		this.server = serverInst;
		this.games = new Map();
		new Logger().info('Server instance created...');
	}

	public static getInstance (server?: ServerWithEvents): undefined | Server {
		if (this.instance === undefined && server !== undefined) this.instance = new Server(server);
		else if (this.instance === undefined) return undefined;
		return this.instance;
	}

	public listener (socket: Socket) {
		new Logger().silly('Client connected', socket.id);

		socket.on('disconnect', () => Server.instance.onDisconnect(socket));

		socket.on('join room', (room, name) => Server.instance.onJoinRoom(socket, room, name));

		socket.on('choose role', (role) => Server.instance.onChooseRole(socket, role));

		socket.on('set secret', (pin: 1 | 2 | 3 | 4, color: PinColor | undefined) => Server.instance.onSetSecret(socket, pin, color));

		socket.on('set pin', (pin: 1 | 2 | 3 | 4, color: PinColor | undefined) => Server.instance.onSetPin(socket, pin, color));

		socket.on('set feedback', (pin: 1 | 2 | 3 | 4, color: FeedbackPinColor | undefined) => Server.instance.onSetFeedback(socket, pin, color));

		socket.on('finish turn', () => Server.instance.onFinishTurn(socket));
	}

	private onDisconnect (socket: Socket) {
		new Logger().silly('Client disconnected', socket.id);
		if (socket.data.room) Server.instance.games.get(socket.data.room)?.round().removePlayer(socket);
	}

	private onJoinRoom (socket: Socket, room: string, name: string) {
		const failJoin = () => {
			new Logger().error('Socket tried to connected without room in request data.');
			return socket.emit('room error');
		};

		// room must not be undefined
		if (room === null || room === undefined) return failJoin();

		// check socket already joined room
		if (socket.rooms.size > 1) {
			const socketRooms = Array.from(socket.rooms);
			if (socketRooms[0] !== room) socketRooms.forEach(room => socket.leave(room));
		}

		// get game
		let game = Server.instance.games.get(room);
		let round = game?.round();
		if (!game) { // create room and game
			new Logger().info('Create room', room);
			game = new Game();
			Server.instance.games.set(room, game);
		} else if (round!.setter !== undefined) {
			if (!round!.setRole(socket, Roles.GUESSER)) return failJoin();

			// player joins room with role
			socket.emit('role assignment', Roles.GUESSER);

			round!.setter.emit('player joined', name);
		} else if (round!.guesser !== undefined) {
			if (!round!.setRole(socket, Roles.SETTER)) return failJoin();

			// player joins room with role
			socket.emit('role assignment', Roles.SETTER);

			round!.guesser.emit('player joined', name);
		}

		// player joins room
		new Logger().info('Socket joins room', socket.id, room);
		socket.join(room);

		// set client data
		socket.data.room = room;
		socket.data.name = name;

		// send client game data
		socket.emit('game data', ClientGame.fromGame(game, socket.id));
	}

	private onChooseRole (socket: Socket, role: Roles) {
		if (socket.rooms.size === 0) return socket.emit('room error');

		const game = Server.instance.games.get(socket.data.room!)!;
		const otherRole = role === Roles.SETTER ? Roles.GUESSER : Roles.SETTER;
		const round = game.round();

		if (round.setRole(socket, role)) {
			socket.emit('role assignment', role);
			if (round[otherRole] !== undefined && round[otherRole]!.id === socket.id) round[otherRole] = undefined;
			else if (round[otherRole] === undefined) {
				const room = Server.instance.server.sockets.adapter.rooms.get(socket.data.room!);

				if (room !== undefined && room.size === 2) {
					const sndSocket = Server.instance.server.sockets.sockets.get(Array.from(room)
						.find((id) => id !== socket.id)!);

					if (sndSocket && round.setRole(sndSocket, otherRole)) sndSocket.emit('role assignment', otherRole);
					else if (sndSocket !== undefined) sndSocket.emit('room error');
				}
			}
		} else {
			if (round.setRole(socket, otherRole)) socket.emit('role assignment', otherRole);
			else return socket.emit('room error');
		}

		// send client game data
		socket.emit('game data', ClientGame.fromGame(game, socket.id));
		if (round[otherRole] !== undefined) round[otherRole]!.emit('game data', ClientGame.fromGame(game, round[otherRole]!.id));
	}

	private setPin (socket: Socket, prohibitedRole: Roles) {
		if (socket.data.room === undefined || !Server.instance.games.has(socket.data.room)) {
			socket.emit('room error');
			new Logger().warn(socket.data.room);
			return false;
		}

		const game: Game = Server.instance.games.get(socket.data.room)!;
		if ((socket !== game.round().setter && socket !== game.round().guesser) || socket === game.round()[prohibitedRole]) {
			socket.emit('room error');
			new Logger()
				.warn(socket === game.round().setter, socket === game.round().guesser, socket === game.round()[prohibitedRole]);
			return false;
		}

		return game;
	}

	private onSetSecret (socket: Socket, pin: 1 | 2 | 3 | 4, color: PinColor | undefined) {
		const game: boolean | Game = Server.instance.setPin(socket, Roles.GUESSER);
		if (game instanceof Game) game.round().hiddenSlot[`pin${ pin }`].color = color;
	}

	private onSetPin (socket: Socket, pin: 1 | 2 | 3 | 4, color: PinColor | undefined) {
		const game: boolean | Game = Server.instance.setPin(socket, Roles.SETTER);
		if (!(game instanceof Game)) return;

		game.round().publicSlot()[`pin${ pin }`].color = color;

		Server.instance.server.in(socket.data.room!).emit('set pin', pin, color);
	}

	private onSetFeedback (socket: Socket, pin: 1 | 2 | 3 | 4, color: FeedbackPinColor | undefined) {
		const game: boolean | Game = Server.instance.setPin(socket, Roles.GUESSER);
		if (!(game instanceof Game)) return;

		game.round().publicSlot().feedback[`pin${ pin }`].color = color;

		Server.instance.server.in(socket.data.room!).emit('set feedback', pin, color);
	}

	private onFinishTurn (socket: Socket) {
		if (socket.data.room === undefined || !Server.instance.games.has(socket.data.room)) {
			socket.emit('room error');
			return false;
		}

		const game: Game = Server.instance.games.get(socket.data.room)!;
		if (socket !== game.round().guesser && socket !== game.round().setter) {
			socket.emit('room error');
			return false;
		}

		if (socket.id === game.round().guesser?.id) {
			if (game.round().publicSlot().setPins && game.round().publicSlot().pinsDefined()) {
				game.round().publicSlot().setPins = false;
				game.round().publicSlot().setFeedback = true;
			} else {
				socket.emit('room error');
				return;
			}
		} else if (socket.id === game.round().setter?.id) {
			if (game.round().publicSlot().setFeedback) {
				game.round().publicSlot().setFeedback = false;
				game.round().publicSlots.push(new Slot());
			} else if (game.round().hiddenSlot.setPins && game.round().hiddenSlot.pinsDefined()) {
				game.round().hiddenSlot.setPins = false;
				game.round().publicSlot().setPins = true;
			} else {
				socket.emit('room error');
				return;
			}
		}

		if (game.round().setter !== undefined)
			game.round().setter!.emit('game data', ClientGame.fromGame(game, game.round().setter!.id));
		if (game.round().guesser !== undefined)
			game.round().guesser!.emit('game data', ClientGame.fromGame(game, game.round().guesser!.id));
	}
}
