'use client';

import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { assert } from 'ts-essentials';

import styles from './ticket-image.module.scss';

interface Props {
	data: ImageData;
	alt?: string;
	className?: string;
}

const TicketImage: FunctionComponent<Props> = ({ data, alt, className }) => {
	const imageDataUrl = getImageDataUrl(data);

	// eslint-disable-next-line @next/next/no-img-element -- locally generated image of a QR code
	return <img src={imageDataUrl} alt={alt} className={clsx(styles.image, className)} />;
};

export default TicketImage;

function getImageDataUrl(data: ImageData): string {
	const canvas = document.createElement('canvas');
	canvas.width = data.width;
	canvas.height = data.height;

	const context = canvas.getContext('2d');
	assert(context, 'Canvas context is null');

	context.putImageData(data, 0, 0);
	return canvas.toDataURL();
}
