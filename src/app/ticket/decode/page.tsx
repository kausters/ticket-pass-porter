'use client';

import { Decoder } from '@nuintun/qrcode';
import type { PDFPageProxy } from 'pdfjs-dist';
import type { PDFOperatorList } from 'pdfjs-dist/types/src/display/api';
import {
	FunctionComponent,
	RefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import { assert } from 'ts-essentials';
import PdfJs from '../view/parse/pdf-js';
import ops from './ops';

interface Operation {
	fn: number;
	op: string;
	arg: any;
}

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
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		(async () => {
			if (file.type === 'application/pdf') {
				const Pdf = await PdfJs;
				const buffer = await file.arrayBuffer();
				const document = await Pdf.getDocument(buffer).promise;
				const page = await document.getPage(1);
				const images = await getQrCodes(page, canvasRef);
				setData(JSON.stringify(images, null, 2));
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
			<canvas ref={canvasRef}></canvas>
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

const opsNames = Object.entries(ops).reduce(
	(acc, [key, value]) => {
		acc[value] = key;
		return acc;
	},
	{} as Record<number, string>,
);

async function getQrCodes(
	page: PDFPageProxy,
	canvasRef: RefObject<HTMLCanvasElement>,
) {
	const canvas = canvasRef.current;
	assert(canvas, 'Canvas ref is not set');

	const canvasContext = canvas.getContext('2d');
	assert(canvasContext, 'Canvas context is not set');

	const viewport = page.getViewport({ scale: 1 });
	console.log(viewport);
	canvas.height = viewport.height;
	canvas.width = viewport.width;

	await page.render({ canvasContext, viewport }).promise;

	const imageData = canvas
		.getContext('2d')!
		.getImageData(0, 0, canvas.width, canvas.height);

	const decoder = new Decoder();
	const decode = decoder.decode(
		imageData.data,
		imageData.width,
		imageData.height,
	);
	console.log(decode);

	return [];
}

async function getDashedLines(page: PDFPageProxy) {
	const operators = await page.getOperatorList();
	const operations = getOperations(operators);
	return findArgsForSequence(operations, [
		ops.setLineWidth,
		ops.setDash,
		ops.setStrokeRGBColor,
		ops.constructPath,
	]);
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

function findArgsForSequence(
	operations: Operation[],
	sequence: Operation['fn'][],
) {
	let seqIndex = 0;
	let matches: Operation['arg'][] = [];

	for (let i = 0; i < operations.length; i++) {
		if (operations[i].fn === sequence[seqIndex]) {
			seqIndex++;
			if (seqIndex === sequence.length) {
				// Add args to the result array
				matches.push(operations[i].arg);

				// Reset sequence to search for next match
				seqIndex = 0;
			}
		} else {
			seqIndex = operations[i].fn === sequence[0] ? 1 : 0;
		}
	}

	return matches;
}
