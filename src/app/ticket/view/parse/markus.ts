import { DateTime, DateTimeOptions } from 'luxon';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { assert } from 'ts-essentials';
import { Ticket, TicketInvoice } from '../tickets.model';

const dateTimeOptions: DateTimeOptions = { zone: 'Europe/Riga', locale: 'lv' };

export async function isValid(pdf: PDFDocumentProxy): Promise<boolean> {
	const metadata = await pdf.getMetadata();
	const info = metadata.info as Record<string, unknown>;

	const expect: Record<string, unknown> = {
		Title: 'Event Tickets',
		Author: 'MCS',
		Subject: 'Tickets',
		Creator: 'MARKUS Cinema System',
	};

	for (const key in expect) {
		if (expect[key] !== info[key]) {
			return false;
		}
	}

	return true;
}

export async function parse(pdf: PDFDocumentProxy): Promise<TicketInvoice> {
	const page = await pdf.getPage(1);
	const textContent = await page.getTextContent();

	const text = textContent.items
		.filter((item): item is TextItem => 'str' in item)
		.map((item) => (item.hasEOL ? item.str + '\n' : item.str))
		.filter((str) => str.trim().length > 0);

	return {
		id: getInvoiceId(text),
		tickets: getTickets(text),
	};
}

function getInvoiceId(data: string[]): string {
	const invoiceIdIndex = 1;
	return data[invoiceIdIndex];
}

function getTickets(data: string[]): Ticket[] {
	return getTicketIndices(data)
		.map(({ start, end }) => data.slice(start, end + 1)) // Include the end row
		.map(parseTicket);
}

function getTicketIndices(data: string[]): { start: number; end: number }[] {
	const endMarker = 'www.forumcinemas.lv'; // A stable value within each ticket
	const endOffset = 1; // How far the ticket ends from the endMarker

	const ticketCount = data.filter((str) => str === endMarker).length;
	const startIndex = 2;

	const ticketRowIndices: { start: number; end: number }[] = [];

	// First ticket starts at startIndex and ends when endMarker is found, plus one row.
	ticketRowIndices.push({
		start: startIndex,
		end: data.indexOf(endMarker, startIndex) + endOffset,
	});

	// The next ticket starts at the end of the previous ticket and ends when endMarker is found, plus one row
	for (let i = 1; i < ticketCount; i++) {
		const previousTicket = ticketRowIndices[i - 1];
		const start = previousTicket.end + 1; // Start at the next row
		const end = data.indexOf(endMarker, start) + endOffset;

		ticketRowIndices.push({ start, end });
	}

	if (ticketRowIndices.length !== ticketCount) {
		throw new Error('Ticket count mismatch');
	}

	return ticketRowIndices;
}

function parseTicket(data: string[]): Ticket {
	return {
		id: getTicketId(data),
		auditorium: data[1],
		section: data[2],
		name: data[3],
		type: data[4],
		rating: data[5],
		row: parseInt(data[10], 10),
		seat: parseInt(data[11], 10),
		purchased: getTicketPurchased(data).toISO()!,
		start: getTicketStart(data).toISO()!,
		price: getTicketPrice(data),
		detail: getTicketDetail(data),
	};
}

function getTicketId(data: string[]): string {
	const idLength = 11;
	const id = data[0];

	/* If the ID is shorter than the expected length, it must have ended with
	a space character (valid alphanumeric) and was trimmed by the PDF reader.
	Unfortunately, that'll make for an invalid ID and a broken QR code, so we
	have to re-pad the end of the ID with spaces to make it valid again. If we
	could actually read the QR off the ticket, we wouldn't have to do this. */

	if (id.length < idLength) {
		return id.padEnd(idLength, ' ');
	} else {
		return id;
	}
}

function getTicketPurchased(data: string[]): DateTime {
	const dateString = data.at(-1);
	assert(dateString !== undefined);

	return DateTime.fromFormat(dateString, 'dd.MM.yyyy HH:mm', dateTimeOptions);
}

function getTicketStart(data: string[]): DateTime {
	const [hour, minute] = data[12].split(':').map((str) => parseInt(str, 10));
	const [day, month] = data[13].split('.').map((str) => parseInt(str, 10));

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

function getTicketPrice(data: string[]): number {
	const prices = data.filter((str) => str.endsWith('EUR'));
	const finalPrice = prices.at(-1);
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

function getTicketDetail(data: string[]): string {
	// Find the first line that ends with '\n' and continue until the first line that doesn't end with '\n' (included)
	const start = data.findIndex((str) => str.endsWith('\n'));
	const end = findIndexFrom(data, (str) => !str.endsWith('\n'), start);
	return data.slice(start, end + 1).join('');
}
