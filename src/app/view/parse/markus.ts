import { PageViewport, PDFDocumentProxy, Util } from 'pdfjs-dist';
import {
	TextContent,
	TextItem,
	TextMarkedContent,
} from 'pdfjs-dist/types//src/display/api';

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

export async function parse(pdf: PDFDocumentProxy): Promise<string> {
	const page = await pdf.getPage(1);
	const textContent = await page.getTextContent();

	const text = textContent.items
		.filter((item): item is TextItem => 'str' in item)
		.map((item) => item.str)
		.filter((str) => str.trim().length > 0);

	const data = {
		invoiceId: getInvoiceId(text),
		tickets: getTickets(text),
	};

	return JSON.stringify(data);
}

function getInvoiceId(data: string[]): string {
	const invoiceIdIndex = 1;
	return data[invoiceIdIndex];
}

function getTickets(data: string[]): Record<string, any>[] {
	return getTicketIndices(data)
		.map((ticket) => data.slice(ticket.start, ticket.end + 1)) // Include the end row
		.map(parseTicket);
}

function parseTicket(data: string[]): Record<string, any> {
	return data;
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
