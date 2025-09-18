'use client';

import { useSearchParams } from 'next/navigation';
import { FunctionComponent, Suspense, useState } from 'react';

import Import from './import';
import Load from './load';
import { TicketInvoice } from './ticket.model';
import View from './view';

export const Converter: FunctionComponent = () => {
	return (
		<div>
			<h1>Ticket</h1>

			<Suspense>
				<Invoice></Invoice>
			</Suspense>
		</div>
	);
};

function Invoice() {
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || undefined;

	const [file, setFile] = useState<File>();
	const [invoice, setInvoice] = useState<TicketInvoice>();

	if (invoice) {
		return <View invoice={invoice} importedFile={file}></View>;
	} else if (file || id) {
		return <Load file={file} id={id} onLoad={setInvoice}></Load>;
	} else {
		return <Import onImport={setFile}></Import>;
	}
}
