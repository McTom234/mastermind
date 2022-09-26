import { Server as IOServer } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './SocketTypes';

let server: IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export class Server {
	private static instance: Server;

	public static getInstance (server: IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>): Server {
		if (this.instance === undefined) this.instance = new Server(server);
		return this.instance;
	}

	constructor (serverInst: IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
		server = serverInst;
	}
	}
}
