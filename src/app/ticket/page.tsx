'use client';

import { useTicketUpload } from './ticket-upload-context';
import TicketUpload from './upload/ticket-upload';
import TicketView from './view/ticket-view';

export default function TicketPage() {
	const { setTicketFile } = useTicketUpload();

	return (
		<div>
			<h1>Ticket</h1>

			<TicketUpload onTicket={setTicketFile}></TicketUpload>
			<TicketView></TicketView>
		</div>
	);
}
