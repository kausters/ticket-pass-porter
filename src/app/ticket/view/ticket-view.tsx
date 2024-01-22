'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTicketUpload } from '../ticket-upload-context';
import { parse as parseClient } from './parse/client';
import { parseInvoiceData } from './parse/parse.utils';
import { parse as parseServer } from './parse/server';
import Ticket from './ticket/ticket';
import styles from './ticket-view.module.scss';
import { TicketInvoice } from './tickets.model';

export default function TicketView() {
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

			<ul className={styles.tickets}>
				{invoice.tickets.map((ticket) => (
					<li key={ticket.code}>
						<Ticket data={ticket} />
					</li>
				))}
			</ul>
		</div>
	);
}

function useInvoice() {
	const { ticketFile } = useTicketUpload();
	const searchParams = useSearchParams();

	const [invoice, setInvoice] = useState<TicketInvoice>();

	// Parsing uploaded ticket is done client-side, so we just do it and update the state after
	useEffect(() => {
		(async () => {
			if (!ticketFile) return;

			const invoiceData = await parseClient(ticketFile);
			const invoice = parseInvoiceData(invoiceData);
			setInvoice(invoice);
		})();
	}, [ticketFile]);

	// Parsing ticket by ID is done server-side, so we declare an effect to do it
	useEffect(() => {
		(async () => {
			const ticketId = searchParams.get('id');
			if (!ticketId) return;

			const invoiceData = await parseServer(ticketId);
			const invoice = parseInvoiceData(invoiceData);
			setInvoice(invoice);
		})();
	}, [searchParams]);

	return invoice;
}
