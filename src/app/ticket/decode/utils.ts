import { Operation } from './ops';

export function findArgsForSequence(
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
