'use client';

import { TicketInvoice } from '../tickets.model';
import {
	isValid as isMarkusTicket,
	parse as parseMarkusTicket,
} from './markus';

const PdfJs: Promise<typeof import('pdfjs-dist')> = new Promise(
	async (resolve) => {
		let [Pdf, PdfWorker] = await Promise.all([
			import('pdfjs-dist/legacy/build/pdf.mjs'),
			// @ts-expect-error
			import('pdfjs-dist/legacy/build/pdf.worker.mjs'),
		]);

		Pdf.GlobalWorkerOptions.workerSrc = PdfWorker;
		resolve(Pdf);
	},
);

export async function parse(file: File): Promise<TicketInvoice> {
	const { getDocument } = await PdfJs;

	const arrayBuffer = await file.arrayBuffer();
	const pdf = await getDocument(arrayBuffer).promise;

	if (await isMarkusTicket(pdf)) {
		return await parseMarkusTicket(pdf);
	}

	throw new Error('Invalid ticket');
}
