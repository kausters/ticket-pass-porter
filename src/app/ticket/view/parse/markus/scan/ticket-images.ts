import { PDFPageProxy } from 'pdfjs-dist';
import { getRectImage, renderPageToCanvas } from '../../../../../../lib/canvas';
import { Rect } from './path.model';

export async function getTicketImages(page: PDFPageProxy, rects: Rect[]) {
	const canvas = await renderPageToCanvas(page);

	return rects
		.map((rect) => flipRect(rect, canvas.height))
		.map((rect) => getRectImage(rect, canvas));
}

function flipRect(rect: Rect, canvasHeight: number) {
	/* PDFs have the origin at the bottom left, but canvas has it at the top left.
	The rects are calculated against the PDF origin, so we need to flip them. */
	return { ...rect, y: canvasHeight - rect.y - rect.height };
}
