import type { PDFDocumentProxy } from 'pdfjs-dist';

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
