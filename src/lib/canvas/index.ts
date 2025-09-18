import { Canvas as NodeCanvas } from 'canvas';
import { PDFPageProxy } from 'pdfjs-dist';

import { Rect } from '../../app/(converter)/parse/markus/scan/path.model';

export async function renderPageToCanvas(page: PDFPageProxy): Promise<HTMLCanvasElement | NodeCanvas> {
	if (isServer()) {
		const { renderPageToCanvas } = await import('./server');
		return renderPageToCanvas(page);
	} else {
		const { renderPageToCanvas } = await import('./client');
		return renderPageToCanvas(page);
	}
}

export async function getRectImageData(rect: Rect, canvas: HTMLCanvasElement | NodeCanvas): Promise<Uint8ClampedArray> {
	if (isServer()) {
		const { getRectImageData } = await import('./server');
		return getRectImageData(rect, canvas as NodeCanvas);
	} else {
		const { getRectImageData } = await import('./client');
		return getRectImageData(rect, canvas as HTMLCanvasElement);
	}
}

function isServer() {
	return typeof window === 'undefined';
}
