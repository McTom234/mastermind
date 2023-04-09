import { FeedbackPinColor, Pin } from 'server/models/Pin';

export class Feedback {
  pin1: Pin<FeedbackPinColor> = new Pin<FeedbackPinColor>();
  pin2: Pin<FeedbackPinColor> = new Pin<FeedbackPinColor>();
  pin3: Pin<FeedbackPinColor> = new Pin<FeedbackPinColor>();
  pin4: Pin<FeedbackPinColor> = new Pin<FeedbackPinColor>();

  public pinsDefined() {
    return this.pin1.color !== undefined && this.pin2.color !== undefined && this.pin3.color !== undefined && this.pin4.color !== undefined;
  }
}
