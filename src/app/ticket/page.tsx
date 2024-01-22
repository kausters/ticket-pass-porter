'use client';

import { useState } from 'react';

import Import from './import';
import Load from './load';
import View from './view';
import { TicketInvoice } from './view/tickets.model';

export default function TicketPage() {
	return (
		<div>
			<h1>Ticket</h1>
			<Invoice></Invoice>
		</div>
	);
}

function Invoice() {
	const [file, setFile] = useState<File>();
	const [invoice, setInvoice] = useState<TicketInvoice>();

	if (invoice) {
		return <View invoice={invoice}></View>;
	} else if (file) {
		return <Load file={file} onLoad={setInvoice}></Load>;
	} else {
		return <Import onImport={setFile}></Import>;
	}
}
