import { PDFDocumentProxy } from 'pdfjs-dist';

import { TicketInvoiceParseData } from '../parse.model';
import { read } from './read';
import { TicketInvoiceReadData } from './read/read.model';
import { scan } from './scan';
import { Scan } from './scan/scan.model';

export { isValid } from './is-valid';

export async function parse(
	pdf: PDFDocumentProxy,
): Promise<TicketInvoiceParseData> {
	const page = await pdf.getPage(1);

	const [readResults, scanResults] = await Promise.all([
		read(page),
		scan(page),
	]);

	if (scanResults.length !== readResults.tickets.length) {
		console.error('Scan and read results do not match, using reads only');
		return readResults as TicketInvoiceParseData;
	}

	// We get image data and a more reliable code from the scan, so we use that
	return mergeResults(readResults, scanResults);
}

function mergeResults(
	readResults: TicketInvoiceReadData,
	scanResults: Scan[],
): TicketInvoiceParseData {
	return {
		id: readResults.id,
		tickets: readResults.tickets.map((ticket, index) => {
			const code = scanResults[index].code || ticket.code;
			const image = scanResults[index].image;
			return { ...ticket, code, image };
		}),
	};
}
