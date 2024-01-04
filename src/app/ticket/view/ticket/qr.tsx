import QrCode from 'qrcode';
import { FunctionComponent, useEffect, useState } from 'react';

const Qr: FunctionComponent<{ data: string }> = ({ data }) => {
	const qrCode = useQrCode(data);
	return <div dangerouslySetInnerHTML={sanitizeSvg(qrCode)}></div>;
};

export default Qr;

function useQrCode(data: string) {
	const [qrCode, setQrCode] = useState<any>();

	useEffect(() => {
		async function updateQrCode() {
			const updatedQrCode = await QrCode.toString(data, {
				width: 150,
				margin: 0,
			});

			return setQrCode(updatedQrCode);
		}

		updateQrCode();
	}, []);

	return qrCode;
}

function sanitizeSvg(dirty: string) {
	return { __html: dirty };
}
