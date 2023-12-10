import { DateTime, DateTimeOptions } from 'luxon';

const format = 'dd.MM.yyyy HH:mm';
const options: DateTimeOptions = {
	zone: 'Europe/Riga',
};

export function parseLatvianDateTime(time: string): DateTime {
	return DateTime.fromFormat(time, format, options);
}
