import { parse } from './parse';

export default async function Page() {
	const data = await parse();

	return (
		<div>
			<h1>PDF data</h1>
			<p>{data}</p>
		</div>
	);
}
