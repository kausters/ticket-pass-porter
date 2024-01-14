'use client';

import { FunctionComponent } from 'react';
import { assert } from 'ts-essentials';

interface Props {
	data: ImageData;
	alt?: string;
}

const ImageData: FunctionComponent<Props> = ({ data, alt }) => {
	const imageDataUrl = getImageDataUrl(data);
	return <img src={imageDataUrl} alt={alt} />;
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
