'use client';

import { useState } from 'react';

import TicketImport from './import/ticket-import';
import { useTicketImport } from './import/ticket-import-context';
import TicketLoad from './load/ticket-load';
import TicketView from './view/ticket-view';
import { TicketInvoice } from './view/tickets.model';

export default function TicketPage() {
	const { setTicketFile } = useTicketImport();
	const [invoice, setInvoice] = useState<TicketInvoice>();

	return (
		<div>
			<h1>Ticket</h1>

			<TicketImport onImport={setTicketFile}></TicketImport>
			<TicketLoad onLoad={setInvoice}></TicketLoad>
			<TicketView invoice={invoice}></TicketView>
		</div>
	);
}
