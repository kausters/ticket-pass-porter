import { PDFPageProxy } from 'pdfjs-dist';
import { getOperations, ops } from './ops';
import { findArgsForSequence } from './utils';

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
