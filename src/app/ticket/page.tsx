'use client';

import TicketImport from './import/ticket-import';
import { useTicketImport } from './import/ticket-import-context';
import TicketView from './view/ticket-view';

export default function TicketPage() {
	const { setTicketFile } = useTicketImport();

	return (
		<div>
			<h1>Ticket</h1>

			<TicketImport onImport={setTicketFile}></TicketImport>
			<TicketView></TicketView>
		</div>
	);
}
