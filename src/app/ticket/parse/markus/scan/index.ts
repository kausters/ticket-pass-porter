import type { PDFPageProxy } from 'pdfjs-dist';

import { encodeImage } from '../../parse.utils';
import { Scan } from './scan.model';
import { getTicketCodes } from './ticket-codes';
import { getTicketImages } from './ticket-images';
import { getTicketRects } from './ticket-rects';

export type { Scan } from './scan.model';

export async function scan(page: PDFPageProxy): Promise<Scan[]> {
	// 1. Find the rectangles of each ticket
	const rects = await getTicketRects(page);

	// 2. Render each ticket to an image
	const images = await getTicketImages(page, rects);

	// 3. Read the QR code from each image
	const codes = getTicketCodes(images);

	// 4. Put them together
	return images.map((imageData, index) => ({
		code: codes[index],
		image: encodeImage(imageData),
	}));
}
