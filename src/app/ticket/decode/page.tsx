'use client';

import { Decoder } from '@nuintun/qrcode';
import { FunctionComponent, useEffect, useState } from 'react';
import PdfJs from '../view/parse/pdf-js';
import { getTicketImageData } from './split-tickets';

const decoder = new Decoder();

const Decode = () => {
	const [file, setFile] = useState<File>();

	function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setFile(file);
		}
	}

	return (
		<div>
			<h1>Decode</h1>

			<form>
				<input type="file" onChange={onFileChange} />
			</form>

			{file && <Result file={file} />}
		</div>
	);
};

const Result: FunctionComponent<{ file: File }> = ({ file }) => {
	const [data, setData] = useState<string>();

	useEffect(() => {
		(async () => {
			if (file.type === 'application/pdf') {
				const Pdf = await PdfJs;
				const buffer = await file.arrayBuffer();
				const document = await Pdf.getDocument(buffer).promise;
				const page = await document.getPage(1);

				const codes = await getTicketImageData(page);
				setData(JSON.stringify(codes, null, 2));
			}

			if (file.type === 'image/png') {
				const url = URL.createObjectURL(file);
				const result = await decoder.scan(url);
				URL.revokeObjectURL(url);
				setData(JSON.stringify(result, null, 2));
			}
		})();
	});

	return (
		<>
			<pre
				style={{
					whiteSpace: 'pre-wrap',
					marginTop: '1rem',
					fontSize: '1rem',
					lineHeight: '1.5rem',
				}}
			>
				{data}
			</pre>
		</>
	);
};

export default Decode;
