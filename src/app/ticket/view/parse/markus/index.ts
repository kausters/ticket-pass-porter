import { PDFDocumentProxy } from 'pdfjs-dist';
import { TicketInvoice } from '../../tickets.model';
import { isValid as isReadValid, read } from './read';

export async function parse(pdf: PDFDocumentProxy): Promise<TicketInvoice> {
	return read(pdf);
}

export async function isValid(pdf: PDFDocumentProxy): Promise<boolean> {
	return isReadValid(pdf);
}
