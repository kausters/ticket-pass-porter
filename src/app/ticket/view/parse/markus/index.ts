import { PDFDocumentProxy } from 'pdfjs-dist';
import { TicketInvoice } from '../../tickets.model';
import { read } from './read';
import { scan } from './scan';

export { isValid } from './is-valid';

export async function parse(pdf: PDFDocumentProxy): Promise<TicketInvoice> {
	const page = await pdf.getPage(1);

	const [readResults, scanResults] = await Promise.all([
		read(page),
		scan(page),
	]);

	if (scanResults.length === readResults.tickets.length) {
		// We get image data and a more reliable code from the scan, so we use that
		readResults.tickets.forEach((ticket, index) => {
			const scanResult = scanResults[index];

			ticket.scan = scanResult.image;
			if (scanResult.code) ticket.code = scanResult.code;
		});
	} else {
		console.error('Scan and read results do not match, using reads only');
	}

	return readResults;
}
