const PdfJs: Promise<typeof import('pdfjs-dist')> = new Promise(
	async (resolve) => {
		let [Pdf, PdfWorker] = await Promise.all([
			import('pdfjs-dist/legacy/build/pdf.mjs'),
			import('pdfjs-dist/legacy/build/pdf.worker.mjs'),
		]);

		Pdf.GlobalWorkerOptions.workerSrc = PdfWorker;
		resolve(Pdf);
	},
);

export default PdfJs;
