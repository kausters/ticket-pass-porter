import { Decoder } from '@nuintun/qrcode';
import { ImageData } from 'canvas';
import { PDFPageProxy } from 'pdfjs-dist';
import { assert } from 'ts-essentials';

interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

// TODO: Read dynamically from PDF (first image)
const bannerHeight = 120;

export async function getQrCodes(page: PDFPageProxy) {
	const canvas = document.createElement('canvas');
	await renderPageToCanvas(page, canvas);

	return getSplitRects(canvas, 2, 2, bannerHeight)
		.map((rect) => getRectImage(canvas, rect))
		.map(decodeImage)
		.filter((decoded) => decoded !== null);
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

// Split image into rectangles (rows × columns)
function getSplitRects(
	canvas: HTMLCanvasElement,
	rows: number,
	columns: number,
	offsetTop = 0,
) {
	const rects: Rect[] = [];
	const width = canvas.width / columns;
	const height = (canvas.height - offsetTop) / rows;

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			rects.push({
				x: j * width,
				y: i * height + offsetTop,
				width,
				height,
			});
		}
	}

	return rects;
}

function getRectImage(canvas: HTMLCanvasElement, rect: Rect) {
	const context = canvas.getContext('2d');
	assert(context, 'Canvas context is null');

	const { x, y, width, height } = rect;
	const imageData = context.getImageData(x, y, width, height);

	drawImage(imageData);
	return imageData;
}

function decodeImage(image: ImageData) {
	const decoder = new Decoder();
	return decoder.decode(image.data, image.width, image.height);
}

function drawImage(imageData: ImageData) {
	const canvas = document.createElement('canvas');
	canvas.width = imageData.width;
	canvas.height = imageData.height;

	const context = canvas.getContext('2d');
	assert(context, 'Canvas context is null');

	context.putImageData(imageData as any, 0, 0);

	const image = new Image();
	image.src = canvas.toDataURL();
	document.body.appendChild(image);
}
