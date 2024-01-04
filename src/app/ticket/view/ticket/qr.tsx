import QrCode from 'qrcode';
import { FunctionComponent, useState } from 'react';

const Qr: FunctionComponent<{ data: string }> = ({ data }) => {
	const qrCode = useQrCode(data);
	return <img src={qrCode} alt={data} />;
};

export default Qr;

function useQrCode(data: string) {
	const [qrCode, setQrCode] = useState<string>();

	QrCode.toDataURL(data, {
		width: 150,
		margin: 0,
	}).then((url) => {
		setQrCode(url);
	});

	return qrCode;
}
