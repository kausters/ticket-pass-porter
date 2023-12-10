import { PageViewport, PDFDocumentProxy, Util } from 'pdfjs-dist';
import {
	TextContent,
	TextItem,
	TextMarkedContent,
} from 'pdfjs-dist/types//src/display/api';

export async function isValid(pdf: PDFDocumentProxy): Promise<boolean> {
	const metadata = await pdf.getMetadata();
	const info = metadata.info as Record<string, unknown>;

	const expect: Record<string, unknown> = {
		Title: 'Event Tickets',
		Author: 'MCS',
		Subject: 'Tickets',
		Creator: 'MARKUS Cinema System',
	};

	for (const key in expect) {
		if (expect[key] !== info[key]) {
			return false;
		}
	}

	return true;
}

export async function parse(pdf: PDFDocumentProxy): Promise<string> {
	const page = await pdf.getPage(1);
	const textContent = await page.getTextContent();

	const text = textContent.items
		.filter((item): item is TextItem => 'str' in item)
		.map((item) => item.str)
		.filter((str) => str.trim().length > 0);

	console.log(text);
	return JSON.stringify(text);
}
