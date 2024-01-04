'use client';

import type { PDFPageProxy } from 'pdfjs-dist';
import type { PDFOperatorList } from 'pdfjs-dist/types/src/display/api';
import { FunctionComponent, useEffect, useState } from 'react';
import PdfJs from '../view/parse/pdf-js';
import ops from './ops';

interface Operation {
	fn: number;
	op: string;
	arg: any;
}

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
			const Pdf = await PdfJs;

			const document = await Pdf.getDocument(await file.arrayBuffer()).promise;
			const page = await document.getPage(1);
			const images = await getImages(page);

			setData(JSON.stringify(images, null, 2));
		})();
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

const opsNames = Object.entries(ops).reduce(
	(acc, [key, value]) => {
		acc[value] = key;
		return acc;
	},
	{} as Record<number, string>,
);

async function getImages(page: PDFPageProxy) {
	const Pdf = await PdfJs;
	const operators = await page.getOperatorList();

	const operations = getOperations(operators);
	console.table(operations);

	const args = operators.fnArray.reduce((acc, kind, i) => {
		if (kind === Pdf.OPS.setDash) {
			const arg = operators.argsArray[i];
			console.log(i);
			acc.push(arg);
		}

		return acc;
	}, [] as any[]);

	return args;
}

function getOperations(operators: PDFOperatorList) {
	const operations: Operation[] = [];
	for (let i = 0; i < operators.fnArray.length; i++) {
		const fn = operators.fnArray[i];
		const op = opsNames[fn];
		const arg = operators.argsArray[i];
		operations.push({ fn, op, arg });
	}
	return operations;
}
