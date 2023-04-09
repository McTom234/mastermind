import express, { Express } from 'express';
import { createServer, Server as HttpServer } from 'http';
import next, { NextApiHandler } from 'next';
import { Server } from 'socket.io';
import { Logger } from './Logger';
import { Server as GameServer, ServerWithEvents } from './Server';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV.trim() !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async() => {
	const app: Express = express();
	const server: HttpServer = createServer(app);
	const io: ServerWithEvents = new Server();
	io.attach(server);

	io.on('connection', GameServer.getInstance(io)!.listener);

	app.all('*', (req: any, res: any) => nextHandler(req, res));

	server.listen(port, () => {
		new Logger().info(`Ready on http://localhost:${ port }`, `Dev mode: ${ dev }`);
	});
}).catch((err) => new Logger().fatal(err));
