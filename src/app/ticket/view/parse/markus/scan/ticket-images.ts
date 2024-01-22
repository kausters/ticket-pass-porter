import { PDFPageProxy } from 'pdfjs-dist';

import {
	getRectImageData,
	renderPageToCanvas,
} from '../../../../../../lib/canvas';
import { Rect } from './path.model';

export async function getTicketImages(page: PDFPageProxy, rects: Rect[]) {
	const canvas = await renderPageToCanvas(page);

	const imagesDataPromises = rects
		.map((rect) => flipRect(rect, canvas.height))
		.map((rect) => getRectImageData(rect, canvas));

	const imagesData = await Promise.all(imagesDataPromises);
	return imagesData.map((data, index) => {
		const rect = rects[index];
		return new ImageData(data, rect.width, rect.height);
	});
}

function flipRect(rect: Rect, canvasHeight: number) {
	/* PDFs have the origin at the bottom left, but canvas has it at the top left.
	The rects are calculated against the PDF origin, so we need to flip them. */
	return { ...rect, y: canvasHeight - rect.y - rect.height };
}
