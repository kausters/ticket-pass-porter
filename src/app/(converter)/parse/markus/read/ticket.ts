import { DateTime, DateTimeOptions } from 'luxon';
import { assert } from 'ts-essentials';

import { Line, TicketReadData } from './read.model';

const dateTimeOptions: DateTimeOptions = { zone: 'Europe/Riga', locale: 'lv' };

export function parseTicket(data: Line[]): TicketReadData {
	return {
		code: getTicketCode(data),
		auditorium: data[1].str,
		section: data[2].str,
		name: data[3].str,
		type: data[4].str,
		rating: data[5].str,
		row: parseInt(data[10].str, 10),
		seat: parseInt(data[11].str, 10),
		purchased: getTicketPurchased(data).toISO()!,
		start: getTicketStart(data).toISO()!,
		price: getTicketPrice(data),
		detail: getTicketDetail(data),
	};
}

function getTicketCode(data: Line[]): string {
	const codeLength = 11;
	const code = data[0].str;

	/* If the ticket code is shorter than expected, it must have ended with
	a space character (valid alphanumeric) and was trimmed by the PDF reader.
	Unfortunately, that'll make for an invalid ID and a broken QR code, so we
	have to re-pad the end of the ID with spaces to make it valid again. This
	is kind of redundant since we read the QR off the ticket, but that is not
	100% reliable, so we'll still keep this as a fallback. */

	if (code.length < codeLength) {
		return code.padEnd(codeLength, ' ');
	} else {
		return code;
	}
}

function getTicketPurchased(data: Line[]): DateTime {
	const dateString = data.at(-1)?.str;
	assert(dateString !== undefined);

	return DateTime.fromFormat(dateString, 'dd.MM.yyyy HH:mm', dateTimeOptions);
}

function getTicketStart(data: Line[]): DateTime {
	const [hour, minute] = data[12].str.split(':').map((str) => parseInt(str, 10));
	const [day, month] = data[13].str.split('.').map((str) => parseInt(str, 10));

	// We don't know the event start year, we'll start with the purchase year and fix it after constructing
	const purchased = getTicketPurchased(data);

	const start = DateTime.local(
		purchased.year,
		month,
		day,
		hour,
		minute,
		dateTimeOptions,
	);

	// Since we don't know the event start year, we base it off ticket purchase year
	if (start > purchased) {
		// Event already starts after it was purchased, nothing to do
		return start;
	} else {
		// Event starts next year (we hopefully won't sell tickets more than a year in advance)
		return start.plus({ years: 1 });
	}
}

function getTicketPrice(data: Line[]): number {
	const prices = data.filter((line) => line.str.endsWith('EUR'));
	const finalPrice = prices.at(-1)?.str;
	assert(finalPrice !== undefined);

	return parseInt(finalPrice.replace(/[.,]/, ''));
}

function findIndexFrom<T>(
	array: T[],
	predicate: Parameters<Array<T>['findIndex']>[0],
	startIndex: number,
): number {
	const indexInSubArray = array.slice(startIndex).findIndex(predicate);
	return indexInSubArray === -1 ? -1 : indexInSubArray + startIndex;
}

function getTicketDetail(data: Line[]): string {
	// Find the first line that ends with '\n' and continue until the first line that doesn't end with '\n' (included)
	const start = data.findIndex((line) => line.str.endsWith('\n'));
	const end = findIndexFrom(data, (line) => !line.str.endsWith('\n'), start);
	return data.slice(start, end + 1).map((line) => line.str).join('');
}
