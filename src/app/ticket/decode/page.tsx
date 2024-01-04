'use client';

import { Decoder } from '@nuintun/qrcode';
import { FunctionComponent, useState } from 'react';

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

	const localUrl = URL.createObjectURL(file);
	decoder
		.scan(localUrl)
		.then((result) => {
			console.log(result);
			setData(JSON.stringify(result));
		})
		.finally(() => {
			URL.revokeObjectURL(localUrl);
		});

	return (
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
	);
};

export default Decode;
