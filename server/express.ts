// noinspection ES6PreferShortImport

import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import { Logger } from './Logger';
import { Server as GameServer, ServerWithEvents } from './Server';

dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.ENV?.trim() !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(async () => {
    const app = express();
    const server = createServer(app);
    const io: ServerWithEvents = new Server();
    io.attach(server);

    const gameServerInstance = GameServer.getInstance(io);
    if (!gameServerInstance) throw new Error('Could not instantiate websocket server.');
    io.on('connection', gameServerInstance.listener);

    app.all('*', (req: Request, res: Response) => nextHandler(req, res));

    server.listen(port, () => {
      new Logger().info(`Ready on http://localhost:${port}`, `Dev mode: ${dev}`);
    });
  })
  .catch((err) => new Logger().fatal(err));
