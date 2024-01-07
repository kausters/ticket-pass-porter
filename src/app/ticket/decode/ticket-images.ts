import { PDFPageProxy } from 'pdfjs-dist';
import { assert } from 'ts-essentials';

interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export async function getTicketImages(page: PDFPageProxy, rects: Rect[]) {
	const canvas = document.createElement('canvas');
	await renderPageToCanvas(page, canvas);

	return rects
		.map((rect) => flipRect(rect, canvas.height))
		.map((rect) => getRectImage(rect, canvas));
}

function renderPageToCanvas(page: PDFPageProxy, canvas: HTMLCanvasElement) {
	const canvasContext = canvas.getContext('2d', { willReadFrequently: true });
	assert(canvasContext, 'Canvas context is null');

	const viewport = page.getViewport({ scale: 1 });
	canvas.width = viewport.width;
	canvas.height = viewport.height;

	const renderOptions: Parameters<PDFPageProxy['render']>[0] = {
		canvasContext,
		viewport,
	};

	return page.render(renderOptions).promise;
}

function flipRect(rect: Rect, canvasHeight: number) {
	/* PDFs have the origin at the bottom left, but canvas has it at the top left.
	The rects are calculated against the PDF origin, so we need to flip them. */
	return { ...rect, y: canvasHeight - rect.y - rect.height };
}

function getRectImage(rect: Rect, canvas: HTMLCanvasElement) {
	const context = canvas.getContext('2d');
	assert(context, 'Canvas context is null');

	const { x, y, width, height } = rect;
	return context.getImageData(x, y, width, height);
}
