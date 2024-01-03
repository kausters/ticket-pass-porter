'use client';

import { TicketInvoice } from '../tickets.model';
import {
	isValid as isMarkusTicket,
	parse as parseMarkusTicket,
} from './markus';

async function SetupPdfJs(): Promise<
	typeof import('pdfjs-dist/legacy/build/pdf.mjs')
> {
	return new Promise((resolve) => {
		return Promise.all([
			import('pdfjs-dist/legacy/build/pdf.mjs'),
			// @ts-expect-error
			import('pdfjs-dist/legacy/build/pdf.worker.mjs'),
		]).then(([Pdf, PdfWorker]) => {
			Pdf.GlobalWorkerOptions.workerSrc = PdfWorker;
			resolve(Pdf);
		});
	});
}

export async function parse(file: File): Promise<TicketInvoice> {
	const { getDocument } = await SetupPdfJs();

	const arrayBuffer = await file.arrayBuffer();
	const pdf = await getDocument(arrayBuffer).promise;

	if (await isMarkusTicket(pdf)) {
		return await parseMarkusTicket(pdf);
	}

	throw new Error('Invalid ticket');
}
