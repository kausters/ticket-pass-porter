'use client';

import { useTicketUpload } from '../ticket-upload-context';

export default function Page() {
	const { ticketFile } = useTicketUpload();
	if (!ticketFile) {
		return;
	}

	const invoice = {};

	const data = JSON.stringify(invoice, null, 2);

	return (
		<div>
			<h1>PDF data</h1>
			<p>{data}</p>
		</div>
	);
}
