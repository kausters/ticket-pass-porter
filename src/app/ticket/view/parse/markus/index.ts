import { PDFDocumentProxy } from 'pdfjs-dist';
import { TicketInvoice } from '../../tickets.model';
import read from './read';
import scan from './scan';

export { isValid } from './is-valid';

export async function parse(pdf: PDFDocumentProxy): Promise<TicketInvoice> {
	const page = await pdf.getPage(1);

	scan(page).then(console.log);
	return read(page);
}
