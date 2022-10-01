import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as tsLog from 'tslog';

export class Logger extends tsLog.Logger {
	private static instance: Logger;
	private static fileLoggerInstance: Logger;
	private static fileName: string;
	private static logLevel: number;

	private constructor () {
		super({
			dateTimeTimezone: 'Europe/Berlin',
			minLevel: 'silly'
		});

		const _logLevels: tsLog.TLogLevelName[] = [
			'silly',
			'trace',
			'debug',
			'info',
			'warn',
			'error',
			'fatal'
		];
		Logger.logLevel = _logLevels.indexOf('silly');

		if (!existsSync(join(process.cwd(), 'logs'))) mkdirSync(join(process.cwd(), 'logs'));

		const date = new Date();
		const year = date.getFullYear();
		const month = (date.getMonth() < 10 ? '0' : '') + date.getMonth();
		const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
		const hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
		const minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
		const second = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

		Logger.fileName = `${ year }-${ month }-${ day }_${ hour }-${ minute }-${ second }_mastermind.log`;

		this.attachTransport({
			silly: Logger.logToFile,
			debug: Logger.logToFile,
			trace: Logger.logToFile,
			info: Logger.logToFile,
			warn: Logger.logToFile,
			error: Logger.logToFile,
			fatal: Logger.logToFile
		});
	}

	public static getLogger () {
		if (this.instance == null) this.instance = new Logger();
		return this.instance;
	}

	private static getFileLogger () {
		if (this.fileLoggerInstance == null) {
			this.fileLoggerInstance = new this();
			this.fileLoggerInstance.setSettings({ colorizePrettyLogs: false });
		}
		return this.fileLoggerInstance;
	}

	private static logToFile (logObject: tsLog.ILogObject) {
		if (logObject.logLevelId >= Logger.logLevel) {
			const stream = createWriteStream(join(process.cwd(), 'logs', Logger.fileName), {
				flags: 'a',
				encoding: 'utf8'
			});
			Logger.getFileLogger().printPrettyLog(stream, logObject);
			stream.close();
		}
	}
}
