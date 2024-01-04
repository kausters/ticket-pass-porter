import { Encoder, ErrorCorrectionLevel, QRAlphanumeric } from '@nuintun/qrcode';
import { FunctionComponent } from 'react';

const Qr: FunctionComponent<{ data: string }> = ({ data }) => {
	const qrCode = useQrCode(data);
	return <img src={qrCode} alt={data} />;
};

export default Qr;

function useQrCode(data: string) {
	const encoder = new Encoder({
		version: 1,
		errorCorrectionLevel: ErrorCorrectionLevel.L,
	});

	encoder.write(new QRAlphanumeric(data));
	encoder.make();

	return encoder.toDataURL(150 / 21, 0);
}
