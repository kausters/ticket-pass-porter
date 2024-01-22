import { Ticket, TicketInvoice } from '../ticket.model';
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
		data: encodeImageData(imageData.data),
	};
}

function encodeImageData(data: Uint8ClampedArray): string {
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(data).toString('base64');
	}

	const binaryString = new Uint8Array(data).reduce(
		(acc, byte) => acc + String.fromCharCode(byte),
		'',
	);
	return btoa(binaryString);
}

/** Decode an image from a string */
export function decodeImage(data: Scan['image']): ImageData {
	return new ImageData(decodeImageData(data.data), data.width, data.height);
}

function decodeImageData(data: string): Uint8ClampedArray {
	if (typeof Buffer !== 'undefined') {
		const decodedArray = Buffer.from(data, 'base64');
		return new Uint8ClampedArray(decodedArray);
	}

	const binaryString = atob(data);
	const len = binaryString.length;

	const bytes = new Uint8ClampedArray(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	return bytes;
}
