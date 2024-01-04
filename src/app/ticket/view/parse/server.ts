'use server';

import path from 'node:path';
import * as PdfJs from 'pdfjs-dist/legacy/build/pdf.mjs';

import { TicketInvoice } from '../tickets.model';
import {
	isValid as isMarkusTicket,
	parse as parseMarkusTicket,
} from './markus';

export async function parse(id: string): Promise<TicketInvoice> {
	const pdfPath = path.resolve(process.cwd(), `sample/${id}.pdf`);

	const { getDocument } = await PdfJs;
	const pdf = await getDocument(pdfPath).promise;

	if (await isMarkusTicket(pdf)) {
		const ticket = await parseMarkusTicket(pdf);
		return JSON.parse(JSON.stringify(ticket));
	}

	throw new Error('Invalid ticket');
}
