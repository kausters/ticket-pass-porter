import { Decoder } from '@nuintun/qrcode';

export function getTicketCodes(images: ImageData[]) {
	const decoder = new Decoder({
		canOverwriteImage: false,
		inversionAttempts: 'dontInvert',
	});

	return images.map((image) => getCode(image, decoder));
}

function getCode(image: ImageData, decoder: Decoder) {
	const width = Math.floor(image.width);
	const height = Math.floor(image.height);
	return decoder.decode(image.data, width, height)?.data;
}
