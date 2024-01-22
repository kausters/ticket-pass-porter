'use client';

import { useRouter } from 'next/navigation';

import { useTicketUpload } from './ticket-upload-context';
import TicketUpload from './upload/ticket-upload';

export default function TicketPage() {
	const { setTicketFile } = useTicketUpload();
	const router = useRouter();

	const onTicket = (ticket: File) => {
		setTicketFile(ticket);
		router.push('ticket/view');
	};

	return (
		<div>
			<h1>Upload</h1>

			<TicketUpload onTicket={onTicket}></TicketUpload>
		</div>
	);
}
