import { Socket } from 'server/Server';
import { Roles } from 'server/SocketTypes';
import { Slot } from 'server/models/Slot';

export class Round {
  setter?: Socket = undefined;
  guesser?: Socket = undefined;

  hiddenSlot: Slot = new Slot();
  publicSlots: Slot[] = [new Slot()];

  constructor() {
    this.publicSlot().setPins = false;
  }

  public setRole(socket: Socket, role: Roles): boolean {
    const roleSocketId = this[role];
    if (roleSocketId) return socket.id === roleSocketId.id;
    this[role] = socket;
    return true;
  }

  public removePlayer(socket: Socket) {
    if (this.setter?.id === socket.id) this.setter = undefined;
    else if (this.guesser?.id === socket.id) this.guesser = undefined;
  }

  public publicSlot() {
    return this.publicSlots[this.publicSlots.length - 1];
  }
}

export class ClientRound {
  hiddenSlot?: Slot;
  publicSlots: Slot[] = [];

  constructor(slots: Slot[], hiddenSlot?: Slot) {
    this.publicSlots.push(...slots);
    this.hiddenSlot = hiddenSlot;
  }

  public static fromRound(round: Round, socketId: string) {
    let hiddenSlotIsVisible = false;
    if (round.setter && round.setter.id === socketId) hiddenSlotIsVisible = true;

    const hiddenSlot = {};
    Object.assign(hiddenSlot, round.hiddenSlot);

    return new ClientRound(
      round.publicSlots.map((slot) => {
        const a = {};
        Object.assign(a, slot);
        return a as Slot;
      }),
      hiddenSlotIsVisible ? (hiddenSlot as Slot) : undefined
    );
  }
}
