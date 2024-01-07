import { assert } from 'ts-essentials';

export function getTicketPreviews(images: ImageData[]) {
	return images.map((image) => getImageDataUrl(image));
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

export function arePreviewsEqual(a: string[], b: string[]) {
	if (a.length !== b.length) return false;
	return a.every((preview, index) => preview === b[index]);
}
