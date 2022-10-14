export class Pin<Type extends PinColor | FeedbackPinColor> {
	color: Type | undefined;

	constructor (color?: Type) {
		this.color = color ?? undefined;
	}
}

export type FeedbackPinColor = 'red' | 'white';

export type PinColor = FeedbackPinColor | 'blue' | 'green' | 'yellow' | 'purple' | 'sandybrown' | 'black';
