import { Socket } from 'socket.io';
import { Round } from './Round';

export class Game {
	player1?: Socket;
	player2?: Socket;

	public addPlayer (socket: Socket): boolean {
		if (this.player1 === undefined && this.player2?.id !== socket.id) this.player1 = socket;
		else if (this.player2 === undefined && this.player1?.id !== socket.id) this.player2 = socket;
		else return this.player1?.id !== socket.id || this.player2?.id !== socket.id;
		return true;
	}

	public removePlayer (socket: Socket) {
		if (this.player1?.id === socket.id) this.player1 = undefined;
		else if (this.player2?.id === socket.id) this.player2 = undefined;
		else return;
		this.round().removePlayer(socket);
	}

	rounds: Round[] = [new Round()];

	public round () {
		return this.rounds[this.rounds.length - 1];
	}
}
