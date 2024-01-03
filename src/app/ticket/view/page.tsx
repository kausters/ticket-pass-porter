'use client';

import { useEffect, useState } from 'react';
import { useTicketUpload } from '../ticket-upload-context';
import { parse as parseServer } from './parse/server';
import { TicketInvoice } from './tickets.model';

export default function Page() {
	const { ticketFile } = useTicketUpload();
	const [invoice, setInvoice] = useState<TicketInvoice | null>(null);

	useEffect(() => {
		const updateInvoice = async () => {
			const updatedInvoice = await parseServer();
			setInvoice(updatedInvoice);
		};

		updateInvoice();
	}, []);

	return (
		<div>
			<h1>PDF data</h1>
			<p>{JSON.stringify(invoice, null, 2)}</p>
		</div>
	);
}
