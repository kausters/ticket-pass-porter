import { Decoder } from '@nuintun/qrcode';

export function getCodes(images: ImageData[]) {
	const decoder = new Decoder({
		canOverwriteImage: false,
		inversionAttempts: 'dontInvert',
	});

	return images.map(
		(image) => decoder.decode(image.data, image.width, image.height)?.data,
	);
}
