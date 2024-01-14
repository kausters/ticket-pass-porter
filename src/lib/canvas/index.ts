import { PDFPageProxy } from 'pdfjs-dist';
import { Rect } from '../../app/ticket/view/parse/markus/scan/path.model';

export async function renderPageToCanvas(page: PDFPageProxy) {
	if (isServer()) {
		throw new Error('Not implemented');
	} else {
		const { renderPageToCanvas } = await import('./client');
		return renderPageToCanvas(page);
	}
}

export function getRectImage(rect: Rect, canvas: HTMLCanvasElement) {
	if (isServer()) {
		throw new Error('Not implemented');
	} else {
		const { getRectImage } = require('./client');
		return getRectImage(rect, canvas);
	}
}

function isServer() {
	return typeof window === 'undefined';
}
