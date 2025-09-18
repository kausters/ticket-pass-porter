'use client';

import { PDFPageProxy } from 'pdfjs-dist';
import { assert } from 'ts-essentials';

import { Rect } from '../../app/(converter)/parse/markus/scan/path.model';

export async function renderPageToCanvas(page: PDFPageProxy) {
	const canvas = document.createElement('canvas');
	const canvasContext = canvas.getContext('2d', { willReadFrequently: true });
	assert(canvasContext, 'Canvas context is null');

	const viewport = page.getViewport({ scale: 1 });
	canvas.width = viewport.width;
	canvas.height = viewport.height;

	const renderOptions: Parameters<PDFPageProxy['render']>[0] = {
		canvasContext,
		viewport,
	};

	await page.render(renderOptions).promise;
	return canvas;
}

export function getRectImageData(rect: Rect, canvas: HTMLCanvasElement) {
	const context = canvas.getContext('2d');
	assert(context, 'Canvas context is null');

	const { x, y, width, height } = rect;
	return context.getImageData(x, y, width, height).data;
}
