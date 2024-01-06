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

	return rects.map((rect) => getRectImage(canvas, rect));
}

function renderPageToCanvas(page: PDFPageProxy, canvas: HTMLCanvasElement) {
	const canvasContext = canvas.getContext('2d');
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

function getRectImage(canvas: HTMLCanvasElement, rect: Rect) {
	const context = canvas.getContext('2d');
	assert(context, 'Canvas context is null');

	const { x, y, width, height } = rect;
	const imageData = context.getImageData(x, y, width, height);

	const preview = getImageDataUrl(imageData);
	return { imageData, preview };
}

function getImageDataUrl(imageData: ImageData) {
	const imageCanvas = document.createElement('canvas');
	imageCanvas.width = imageData.width;
	imageCanvas.height = imageData.height;

	const context = imageCanvas.getContext('2d');
	assert(context, 'Canvas context is null');

	context.putImageData(imageData, 0, 0);
	return imageCanvas.toDataURL();
}
