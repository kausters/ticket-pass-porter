'use client';

import { assert } from 'ts-essentials';

const ImageData = ({ data }: { data: ImageData }) => {
	const imageDataUrl = getImageDataUrl(data);
	return <img src={imageDataUrl} alt="" />;
};

export default ImageData;

function getImageDataUrl(data: ImageData): string {
	const canvas = document.createElement('canvas');
	canvas.width = data.width;
	canvas.height = data.height;

	const context = canvas.getContext('2d');
	assert(context, 'Canvas context is null');

	context.putImageData(data, 0, 0);
	return canvas.toDataURL();
}
