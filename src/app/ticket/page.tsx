'use client';

import { useState } from 'react';

import TicketImport from './import/ticket-import';
import TicketLoad from './load/ticket-load';
import TicketView from './view/ticket-view';
import { TicketInvoice } from './view/tickets.model';

export default function TicketPage() {
	const [ticketFile, setTicketFile] = useState<File>();
	const [invoice, setInvoice] = useState<TicketInvoice>();

	return (
		<div>
			<h1>Ticket</h1>

			<TicketImport onImport={setTicketFile}></TicketImport>
			<TicketLoad ticketFile={ticketFile} onLoad={setInvoice}></TicketLoad>
			<TicketView invoice={invoice}></TicketView>
		</div>
	);
}
