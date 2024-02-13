import { PDFDocumentProxy } from 'pdfjs-dist';

import { TicketInvoiceParseData, TicketParseData } from '../parse.model';
import { load, TicketInvoiceLoadData } from './load';
import { read, TicketInvoiceReadData } from './read';
import { Scan, scan } from './scan';

export { isValid } from './is-valid';

interface ParseResults {
	readResults: TicketInvoiceReadData;
	loadResults?: TicketInvoiceLoadData;
	scanResults?: Scan[];
}

export async function parse(
	pdf: PDFDocumentProxy,
): Promise<TicketInvoiceParseData> {
	const page = await pdf.getPage(1);

	const [readResults, scanResults] = await Promise.all([
		read(page),
		scan(page),
	]);

	// Load some extra data from the API
	const loadResults = await load(readResults);

	if (scanResults.length !== readResults.tickets.length) {
		console.error('Scan and read results do not match, using reads only');
		return mergeResults({ readResults, loadResults });
	}

	// Combine the results from read, load and scan into one object
	return mergeResults({ readResults, loadResults, scanResults });
}

function mergeResults({
	readResults,
	loadResults,
	scanResults,
}: ParseResults): TicketInvoiceParseData {
	return {
		...readResults,
		tickets: readResults.tickets.map((ticket, index) => {
			const update = {} as TicketParseData;

			if (scanResults) {
				// We get image data and a more reliable code from the scan, so we use that
				const scanResult = scanResults[index];
				update.code = scanResult.code || ticket.code;
				update.image = scanResult.image;
			}

			if (loadResults) {
				// We get the actual show end time from the load, so we use that
				update.end = loadResults.end;
			}

			return { ...ticket, ...update };
		}),
	};
}
