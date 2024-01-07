import { PDFPageProxy } from 'pdfjs-dist';
import { PDFOperatorList } from 'pdfjs-dist/types/src/display/api';
import { ops } from '../../../../decode/ops';
import { Line, Point } from './path.model';

interface Operation {
	fn: number;
	args: any[];
}

type LineArgsOps = [typeof ops.moveTo, typeof ops.lineTo];
type LineArgsCoords = [x1: number, y1: number, x2: number, y2: number];
type LineOpArgs = [ops: LineArgsOps, coords: LineArgsCoords];

export async function getTicketRects(page: PDFPageProxy) {
	const operators = await page.getOperatorList();
	const operations = getOperations(operators);

	const lines = operations
		.filter((op) => op.fn === ops.constructPath)
		.map((op) => op.args)
		.filter(isLineOpArg)
		.map(lineOpArgToLine);

	const intersects = findIntersectingLines(lines);
	return intersects.map(getRectFromLines);
}

function getOperations(operators: PDFOperatorList) {
	const operations: Operation[] = [];
	for (let i = 0; i < operators.fnArray.length; i++) {
		const fn = operators.fnArray[i];
		const args = operators.argsArray[i];
		operations.push({ fn, args });
	}
	return operations;
}

function isLineOpArg(args: unknown[]): args is LineOpArgs {
	if (args.length < 2) return false;
	const [commands, coords] = args;

	if (!Array.isArray(commands)) return false;
	if (commands[0] !== ops.moveTo || commands[1] !== ops.lineTo) return false;

	return !(!Array.isArray(coords) || coords.length !== 4);
}

function lineOpArgToLine([, [x1, y1, x2, y2]]: LineOpArgs): Line {
	const start: Point = { x: x1, y: y1 };
	const end: Point = { x: x2, y: y2 };
	return { start, end };
}

function doLinesIntersect(line1: Line, line2: Line) {
	function direction(a: Point, b: Point, c: Point) {
		return (c.y - a.y) * (b.x - a.x) - (b.y - a.y) * (c.x - a.x);
	}

	let d1 = direction(line1.start, line1.end, line2.start);
	let d2 = direction(line1.start, line1.end, line2.end);
	let d3 = direction(line2.start, line2.end, line1.start);
	let d4 = direction(line2.start, line2.end, line1.end);

	return (
		((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
		((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
	);
}

function findIntersectingLines(lines: Line[]) {
	let intersectingLines = [];

	for (let i = 0; i < lines.length - 1; i++) {
		const line1 = lines[i];
		const line2 = lines[i + 1];

		if (doLinesIntersect(line1, line2)) {
			intersectingLines.push([line1, line2]);
		}
	}

	return intersectingLines;
}

function getRectFromLines(lines: Line[]) {
	const initialExtremes = {
		minX: Number.MAX_VALUE,
		minY: Number.MAX_VALUE,
		maxX: Number.MIN_VALUE,
		maxY: Number.MIN_VALUE,
	};

	const { minX, minY, maxX, maxY } = lines.reduce((extremes, line) => {
		return {
			minX: Math.min(extremes.minX, line.start.x, line.end.x),
			minY: Math.min(extremes.minY, line.start.y, line.end.y),
			maxX: Math.max(extremes.maxX, line.start.x, line.end.x),
			maxY: Math.max(extremes.maxY, line.start.y, line.end.y),
		};
	}, initialExtremes);

	const x = minX;
	const y = minY;
	const width = maxX - minX;
	const height = maxY - minY;

	return { x, y, width, height };
}
