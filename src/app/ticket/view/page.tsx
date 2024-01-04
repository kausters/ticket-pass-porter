'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTicketUpload } from '../ticket-upload-context';
import { parse as parseClient } from './parse/client';
import { parse as parseServer } from './parse/server';
import { TicketInvoice } from './tickets.model';

export default function Page() {
	const { ticketFile } = useTicketUpload();
	const [invoice, setInvoice] = useState<TicketInvoice>();

	const searchParams = useSearchParams();

	useEffect(() => {
		const updateInvoice = async () => {
			if (ticketFile) {
				const updatedInvoice = await parseClient(ticketFile);
				setInvoice(updatedInvoice);
			} else if (searchParams.has('id')) {
				const ticketId = searchParams.get('id')!;
				const updatedInvoice = await parseServer(ticketId);
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
