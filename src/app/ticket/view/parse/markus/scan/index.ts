import type { PDFPageProxy } from 'pdfjs-dist';
import { getCodes } from '../../../../decode/scan-tickets';
import { getTicketImages } from '../../../../decode/ticket-images';
import { getTicketRects } from '../../../../decode/ticket-rects';

async function scan(page: PDFPageProxy): Promise<(string | undefined)[]> {
	// 1. Find the rectangles of each ticket
	const rects = await getTicketRects(page);

	// 2. Render each ticket to an image
	const images = await getTicketImages(page, rects);

	// 3. Read the QR code from each image
	return getCodes(images);
}

export default scan;
