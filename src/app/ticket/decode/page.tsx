'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import PdfJs from '../../../lib/pdf/pdf-js';
import { scan } from '../view/parse/markus/scan';
import { decodeImage } from '../view/parse/parse.utils';
import { arePreviewsEqual, getTicketPreviews } from './ticket-previews';

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
	const [previews, setPreviews] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			if (file.type === 'application/pdf') {
				const Pdf = await PdfJs;
				const buffer = await file.arrayBuffer();
				const document = await Pdf.getDocument(buffer).promise;
				const page = await document.getPage(1);

				const scans = await scan(page);
				const images = scans.map((scan) => decodeImage(scan.image));
				const codes = scans.map((scan) => scan.code);

				setPreviews((oldPreviews) => {
					const newPreviews = getTicketPreviews(images);
					return arePreviewsEqual(oldPreviews, newPreviews)
						? oldPreviews
						: newPreviews;
				});

				setData(JSON.stringify(codes, null, 2));
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

			{previews && (
				<div>
					{previews.map((image, index) => (
						<img key={index} src={image} />
					))}
				</div>
			)}
		</>
	);
};

export default Decode;
