import {ILogObj, Logger as TSLogger} from 'tslog';
import {createStream} from "rotating-file-stream";
import {format} from 'date-fns';

export class Logger extends TSLogger<ILogObj> {
	constructor () {
		super({
			minLevel: 0,
		});

        const generator = (date: Date|number) => {
            if (! (date instanceof Date)) {
                return `mastermind-${date}.log`;
            }

            return `${ format(date, 'yyyy-MM-dd_HH-mm-ss') }_mastermind.log`;
        }

		const fileStream = createStream(generator, {
            path: 'logs',
            size: '10M',
            interval: '7d',
			initialRotation: true,
        });

		this.attachTransport(({_meta, ...log}) => {
			fileStream.write(`${format(new Date(_meta.date), 'yyyy-MM-dd HH:mm:ss:SSS')}\t${_meta.logLevelName}\t${_meta.path ? _meta.path.filePathWithLine : '*no path*'}\t${Object.values(log).join(' ')}\n`);
		});
	}
}
