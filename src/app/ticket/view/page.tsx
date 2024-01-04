'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTicketUpload } from '../ticket-upload-context';
import { parse as parseClient } from './parse/client';
import { parse as parseServer } from './parse/server';
import Ticket from './ticket/ticket';
import { TicketInvoice } from './tickets.model';

export default function Page() {
	const invoice = useInvoice();

	if (!invoice)
		return (
			<div>
				<p>No invoice.</p>
			</div>
		);

	return (
		<div>
			<h1>Invoice #{invoice.id}</h1>

			{invoice.tickets.map((ticket) => (
				<Ticket key={ticket.id} data={ticket} />
			))}
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
