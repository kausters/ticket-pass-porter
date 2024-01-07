import { Decoder } from '@nuintun/qrcode';

export function getTicketCodes(images: ImageData[]) {
	const decoder = new Decoder({
		canOverwriteImage: false,
		inversionAttempts: 'dontInvert',
	});

	return images.map((image) => getCode(image, decoder));
}

function getCode(image: ImageData, decoder: Decoder) {
	return decoder.decode(image.data, image.width, image.height)?.data;
}
