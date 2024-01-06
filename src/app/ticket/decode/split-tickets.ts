import { PDFPageProxy } from 'pdfjs-dist';
import { getTicketImages } from './ticket-images';
import { getTicketRects } from './ticket-rects';

export async function getTicketImageData(page: PDFPageProxy) {
	// 1. Find the rectangles of each ticket
	const rects = await getTicketRects(page);

	// 2. Render each ticket to an image
	const images = await getTicketImages(page, rects);
	console.log(images);
}
