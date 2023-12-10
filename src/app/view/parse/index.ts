'use server';

import path from 'path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
	isValid as isMarkusTicket,
	parse as parseMarkusTicket,
} from './markus';

export async function parse(): Promise<string> {
	console.clear();
	const pdfPath = path.resolve(process.cwd(), 'sample/4171657442.pdf');
	const pdf = await getDocument(pdfPath).promise;

	if (await isMarkusTicket(pdf)) {
		return await parseMarkusTicket(pdf);
	}

	return 'Not Markus ticket';
}
