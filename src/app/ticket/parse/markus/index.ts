import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

import { TicketInvoiceParseData, TicketInvoiceParseResults, TicketParseData } from '../parse.model';
import { load } from './load';
import { read } from './read';
import { scan } from './scan';

export { isValid } from './is-valid';

export async function parse(pdf: PDFDocumentProxy): Promise<TicketInvoiceParseData> {
	const page = await pdf.getPage(1);
	const { readResults, loadResults, scanResults } = await getResults(page);

	if (scanResults?.length !== readResults.tickets.length) {
		console.error('Scan and read results do not match, using reads only');
		return mergeResults({ readResults, loadResults });
	}

	// Combine the results from read, load and scan into one object
	return mergeResults({ readResults, loadResults, scanResults });
}

async function getResults(page: PDFPageProxy): Promise<TicketInvoiceParseResults> {
	// Start both read and scan operations immediately to run in parallel
	const readPromise = read(page);
	const scanPromise = scan(page);

	// Wait for the read operation to complete before starting the load operation
	const readResults = await readPromise;
	const loadPromise = load(readResults);

	// Wait for both the scan operation and the load operation to complete
	const [scanResults, loadResults] = await Promise.all([scanPromise, loadPromise]);

	return { readResults, loadResults, scanResults };
}

function mergeResults({ readResults, loadResults, scanResults }: TicketInvoiceParseResults): TicketInvoiceParseData {
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

			// We get the actual show end time from the load, so we use that
			const loadResult = loadResults[index];
			update.end = loadResult.end;

			return { ...ticket, ...update };
		}),
	};
}
