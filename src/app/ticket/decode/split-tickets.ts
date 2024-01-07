import type { PDFPageProxy } from 'pdfjs-dist';
import type { Dispatch, SetStateAction } from 'react';
import { getTicketImages } from './ticket-images';
import { getTicketRects } from './ticket-rects';

export async function getTicketImageData(
	page: PDFPageProxy,
	setImages?: Dispatch<SetStateAction<string[]>>,
) {
	// 1. Find the rectangles of each ticket
	const rects = await getTicketRects(page);

	// 2. Render each ticket to an image and send the previews to the parent
	const images = await getTicketImages(page, rects);
	const previews = images.map((image) => image.preview);

	setImages?.((old) => (arePreviewsEqual(old, previews) ? old : previews));
}

function arePreviewsEqual(a: string[], b: string[]) {
	if (a.length !== b.length) return false;
	return a.every((preview, index) => preview === b[index]);
}
