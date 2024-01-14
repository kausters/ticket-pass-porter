'use client';

import PdfJs from '../../../../lib/pdf/pdf-js';
import {
	isValid as isMarkusTicket,
	parse as parseMarkusTicket,
} from './markus';
import { TicketInvoiceParseData } from './parse.model';

export async function parse(file: File): Promise<TicketInvoiceParseData> {
	const { getDocument } = await PdfJs;

	const arrayBuffer = await file.arrayBuffer();
	const pdf = await getDocument(arrayBuffer).promise;

	if (await isMarkusTicket(pdf)) {
		return await parseMarkusTicket(pdf);
	}

	throw new Error('Invalid ticket');
}
