import type { PDFPageProxy } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

import { getCalendarEventData, getInvoiceId, getLocation } from './invoice';
import { Line, TicketInvoiceReadData } from './read.model';
import { getTickets } from './tickets';

export async function read(page: PDFPageProxy): Promise<TicketInvoiceReadData> {
	const textContent = await page.getTextContent();

	const lines: Line[] = textContent.items
		.filter((item): item is TextItem => 'str' in item)
		.map((item) => ({
			// Keep the trailing newline so callers can detect wrapped lines
			str: item.hasEOL ? item.str + '\n' : item.str,
			// transform is [a, b, c, d, x, y] — we only need the page position
			x: item.transform[4],
			y: item.transform[5],
			hasEOL: item.hasEOL,
		}))
		.filter((line) => line.str.trim().length > 0);

	return {
		id: getInvoiceId(lines),
		tickets: getTickets(lines),
		location: getLocation(),
		calendarEventData: getCalendarEventData(),
	};
}
