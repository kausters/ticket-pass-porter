'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTicketUpload } from '../ticket-upload-context';
import { parse as parseClient } from './parse/client';
import { parse as parseServer } from './parse/server';
import { TicketInvoice } from './tickets.model';

export default function Page() {
	const invoice = useInvoice();

	return (
		<div>
			<h1>PDF data</h1>
			<p>{JSON.stringify(invoice, null, 2)}</p>
		</div>
	);
}

function useInvoice() {
	const { ticketFile } = useTicketUpload();
	const searchParams = useSearchParams();

	const [invoice, setInvoice] = useState<TicketInvoice>();

	useEffect(() => {
		async function updateInvoice() {
			if (ticketFile) {
				const updatedInvoice = await parseClient(ticketFile);
				return setInvoice(updatedInvoice);
			}

			if (searchParams.has('id')) {
				const ticketId = searchParams.get('id')!;
				const updatedInvoice = await parseServer(ticketId);
				return setInvoice(updatedInvoice);
			}

			setInvoice(undefined);
		}

		updateInvoice();
	}, []);

	return invoice;
}
