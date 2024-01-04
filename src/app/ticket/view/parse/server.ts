'use server';

import path from 'node:path';

import { TicketInvoice } from '../tickets.model';
import {
	isValid as isMarkusTicket,
	parse as parseMarkusTicket,
} from './markus';
import PdfJs from './pdf-js';

export async function parse(id: string): Promise<TicketInvoice> {
	const pdfPath = path.resolve(process.cwd(), `sample/${id}.pdf`);

	const { getDocument } = await PdfJs;
	const pdf = await getDocument(pdfPath).promise;

	if (await isMarkusTicket(pdf)) {
		return parseMarkusTicket(pdf);
	}

	throw new Error('Invalid ticket');
}
