export interface Scan {
	code: string | undefined;
	image: {
		width: number;
		height: number;
		data: Uint8ClampedArray;
	};
}
