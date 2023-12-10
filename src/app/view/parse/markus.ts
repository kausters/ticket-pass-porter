import { parseLatvianDateTime } from '@/app/view/parse/date-time';
import { DateTime } from 'luxon';
import assert from 'node:assert';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types//src/display/api';
import { Ticket, TicketInvoice } from '../tickets.model';

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
		.map((item) => item.str)
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
		.map((ticket) => data.slice(ticket.start, ticket.end + 1)) // Include the end row
		.map((data) => {
			console.log(data);
			const ticket = parseTicket(data);

			console.log(ticket);
			return ticket;
		});
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
	const purchased = getTicketPurchased(data);

	return {
		id: data[0],
		auditorium: data[1],
		section: data[2],
		name: data[3],
		type: data[4],
		rating: data[5],
		row: parseInt(data[10], 10),
		seat: parseInt(data[11], 10),
		purchased: purchased.toJSDate(),
		start: getTicketStart(data),
		price: getTicketPrice(data),
		detail: getTicketDetail(data),
	};
}

function getTicketPurchased(data: string[]): DateTime {
	const dateString = data.at(-1);
	assert(dateString !== undefined);

	return parseLatvianDateTime(dateString);
}

function getTicketStart(data: string[]): Date {
	return new Date();
}

function getTicketPrice(data: string[]): number {
	return 0;
}

function getTicketDetail(data: string[]): string {
	return '';
}
