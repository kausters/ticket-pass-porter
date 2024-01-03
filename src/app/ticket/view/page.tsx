'use client';

import { use } from 'react';
import { useTicketUpload } from '../ticket-upload-context';
import { parse as parseClient } from './parse/client';

async function parse(file?: File) {
	if (!file) return null;

	return await parseClient(file);
}

export default function Page() {
	const { ticketFile } = useTicketUpload();
	const invoice = use(parse(ticketFile));

	const data = JSON.stringify(invoice, null, 2);

	return (
		<div>
			<h1>PDF data</h1>
			<p>{data}</p>
		</div>
	);
}
