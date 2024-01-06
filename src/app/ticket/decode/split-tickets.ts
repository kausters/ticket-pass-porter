import { PDFPageProxy } from 'pdfjs-dist';
import { getTicketImages } from './ticket-images';
import { getTicketRects } from './ticket-rects';

export async function getTicketImageData(
	page: PDFPageProxy,
	setImages?: (images: string[]) => void,
) {
	// 1. Find the rectangles of each ticket
	const rects = await getTicketRects(page);

	// 2. Render each ticket to an image and send the previews to the parent
	const images = await getTicketImages(page, rects);
	setImages?.(images.map((image) => image.preview));

	console.log(images);
}
