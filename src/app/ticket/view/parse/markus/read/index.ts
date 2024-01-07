import type { PDFPageProxy } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { TicketInvoice } from '../../../tickets.model';
import { getInvoiceId } from './invoice';
import { getTickets } from './tickets';

async function read(page: PDFPageProxy): Promise<TicketInvoice> {
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

export default read;
