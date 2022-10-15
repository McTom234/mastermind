import { Feedback } from '../server/models/Feedback';
import { ClientGame } from '../server/models/Game';
import { ClientRound, Round } from '../server/models/Round';
import { Slot as SlotModel } from '../server/models/Slot';

export function currentRoundOfGame (game: ClientGame) {
	if (game.rounds.length === 0) game.rounds.push(ClientRound.fromRound(new Round(), ''));
	return game.rounds[game.rounds.length - 1];
}

export function publicSlotOfRound (round: ClientRound) {
	if (round.publicSlots.length === 0) round.publicSlots.push(new SlotModel());
	return round.publicSlots[round.publicSlots.length - 1];
}

export function currentPublicSlotOfGame (game: ClientGame) {
	return publicSlotOfRound(currentRoundOfGame(game));
}


export function pinsDefined (slot: SlotModel | Feedback) {
	return slot.pin1.color !== undefined && slot.pin2.color !== undefined && slot.pin3.color !== undefined && slot.pin4.color !== undefined;
}
