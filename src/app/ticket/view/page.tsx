'use client';

import { useEffect, useState } from 'react';
import { useTicketUpload } from '../ticket-upload-context';
import { parse as parseClient } from './parse/client';
import { TicketInvoice } from './tickets.model';

export default function Page() {
	const { ticketFile } = useTicketUpload();
	const [invoice, setInvoice] = useState<TicketInvoice>();

	useEffect(() => {
		const updateInvoice = async () => {
			if (ticketFile) {
				const updatedInvoice = await parseClient(ticketFile);
				setInvoice(updatedInvoice);
			} else {
				setInvoice(undefined);
			}
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
