// noinspection ES6PreferShortImport

import { Feedback } from '../models/Feedback';
import { Pin, PinColor } from '../models/Pin';

export class Slot {
  pin1: Pin<PinColor> = new Pin<PinColor>();
  pin2: Pin<PinColor> = new Pin<PinColor>();
  pin3: Pin<PinColor> = new Pin<PinColor>();
  pin4: Pin<PinColor> = new Pin<PinColor>();

  feedback: Feedback = new Feedback();

  setPins = true;
  setFeedback = false;

  public pinsDefined() {
    return this.pin1.color !== undefined && this.pin2.color !== undefined && this.pin3.color !== undefined && this.pin4.color !== undefined;
  }
}
