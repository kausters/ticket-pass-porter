'use server';

import { Canvas } from 'canvas';
import { PDFPageProxy } from 'pdfjs-dist';

import { Rect } from '../../app/ticket/parse/markus/scan/path.model';

if (typeof ImageData === 'undefined') {
	/* Next.js sometimes goes stupid and doesn't load ImageData into its server
	actions, but sometimes it does. Using ImageData from 'canvas' package doesn't
	work since there's a type mismatch between one Uint8ClampedArray type and
	some other Uint8ClampedArray type. The `image-data` package works. */
	const ImageData = require('@canvas/image-data');
	global.ImageData = ImageData as any;
}

export async function renderPageToCanvas(page: PDFPageProxy): Promise<Canvas> {
	const viewport = page.getViewport({ scale: 1 });
	const canvas = new Canvas(viewport.width, viewport.height);

	const canvasContext = canvas.getContext('2d');
	const renderOptions: Parameters<PDFPageProxy['render']>[0] = {
		canvasContext: canvasContext as unknown as CanvasRenderingContext2D,
		viewport,
	};

	await page.render(renderOptions).promise;
	return canvas;
}

export async function getRectImageData(
	rect: Rect,
	canvas: Canvas,
): Promise<Uint8ClampedArray> {
	const context = canvas.getContext('2d');
	const { x, y, width, height } = rect;
	const image = context.getImageData(x, y, width, height);
	return image.data;
}
