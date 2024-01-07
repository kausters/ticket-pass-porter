'use server';

import path from 'node:path';
import PdfJs from '../../../../lib/pdf/pdf-js';

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
		return parseMarkusTicket(pdf);
	}

	throw new Error('Invalid ticket');
}
