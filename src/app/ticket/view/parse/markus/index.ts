import { PDFDocumentProxy } from 'pdfjs-dist';
import { TicketInvoice } from '../../tickets.model';
import read from './read';

export { isValid } from './is-valid';

export async function parse(pdf: PDFDocumentProxy): Promise<TicketInvoice> {
	return read(pdf);
}
