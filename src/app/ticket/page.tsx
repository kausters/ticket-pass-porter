'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import Import from './import';
import Load from './load';
import { TicketInvoice } from './ticket.model';
import View from './view';

export default function TicketPage() {
	return (
		<div>
			<h1>Ticket</h1>
			<Invoice></Invoice>
		</div>
	);
}

function Invoice() {
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || undefined;

	const [file, setFile] = useState<File>();
	const [invoice, setInvoice] = useState<TicketInvoice>();

	if (invoice) {
		return <View invoice={invoice}></View>;
	} else if (file || id) {
		return <Load file={file} id={id} onLoad={setInvoice}></Load>;
	} else {
		return <Import onImport={setFile}></Import>;
	}
}
