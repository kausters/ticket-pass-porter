import { Ticket, TicketInvoice } from '../tickets.model';
import { Scan } from './markus/scan/scan.model';
import { TicketInvoiceParseData, TicketParseData } from './parse.model';

export function parseInvoiceData(data: TicketInvoiceParseData): TicketInvoice {
	return {
		id: data.id,
		tickets: data.tickets.map(parseTicketData),
	};
}

export function parseTicketData(data: TicketParseData): Ticket {
	return {
		...data,
		image: decodeImage(data.image),
	};
}

/** Encode an image to a string */
export function encodeImage(imageData: ImageData): Scan['image'] {
	return {
		width: imageData.width,
		height: imageData.height,
		data: imageData.data.join(','),
	};
}

/** Decode an image from a string */
export function decodeImage(data: Scan['image']): ImageData {
	const imageDataArray = data.data.split(',').map(Number);
	const imageData = Uint8ClampedArray.from(imageDataArray);
	return new ImageData(imageData, data.width, data.height);
}
