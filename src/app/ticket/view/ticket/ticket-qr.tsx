import { Encoder, ErrorCorrectionLevel, QRAlphanumeric } from '@nuintun/qrcode';
import { FunctionComponent } from 'react';
import styles from './ticket-qr.module.scss';

const QR_WIDTH = 150;

const TicketQr: FunctionComponent<{ data: string }> = ({ data }) => {
	const qrCode = useQrCode(data);
	return (
		<img src={qrCode} alt={data} className={styles.image} width={QR_WIDTH} />
	);
};

function useQrCode(data: string) {
	const encoder = new Encoder({
		version: 1,
		errorCorrectionLevel: ErrorCorrectionLevel.L,
	});

	encoder.write(new QRAlphanumeric(data));
	encoder.make();

	const moduleSize = QR_WIDTH / encoder.getMatrixSize();
	return encoder.toDataURL(moduleSize * devicePixelRatio, 0);
}

export default TicketQr;
