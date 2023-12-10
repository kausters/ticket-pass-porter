import { parse } from './parse';

export default async function Page() {
	const invoice = await parse();
	const data = JSON.stringify(invoice, null, 2);

	return (
		<div>
			<h1>PDF data</h1>
			<p>{data}</p>
		</div>
	);
}
