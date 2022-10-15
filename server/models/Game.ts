import { ClientRound, Round } from './Round';

export class Game {
	rounds: Round[] = [new Round()];

	public round () {
		return this.rounds[this.rounds.length - 1];
	}
}

export class ClientGame {
	playerName?: string;
	rounds: ClientRound[] = [];

	constructor (rounds: ClientRound[], playerName?: string) {
		this.rounds.push(...rounds);
		this.playerName = playerName;
	}

	public static fromGame (game: Game, socketId: string) {
		let playerName;
		const round = game.round();
		if (round.setter?.id === socketId) playerName = round.setter.data.name;
		if (round.guesser?.id === socketId) playerName = round.guesser.data.name;

		return new ClientGame(game.rounds.map((round) => ClientRound.fromRound(round, socketId)), playerName);
	}
}
