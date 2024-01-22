import { useSearchParams } from 'next/navigation';
import { FunctionComponent, useEffect } from 'react';

import { parse as parseClient } from '../view/parse/client';
import { parseInvoiceData } from '../view/parse/parse.utils';
import { parse as parseServer } from '../view/parse/server';
import { TicketInvoice } from '../view/tickets.model';

interface Props {
	ticketFile?: File;
	onLoad: (invoice: TicketInvoice) => void;
}

const TicketLoad: FunctionComponent<Props> = ({ ticketFile, onLoad }) => {
	const searchParams = useSearchParams();

	// Parsing uploaded ticket is done client-side, so we just do it and update the state after
	useEffect(() => {
		(async () => {
			if (!ticketFile) return;

			const invoiceData = await parseClient(ticketFile);
			const invoice = parseInvoiceData(invoiceData);
			onLoad(invoice);
		})();
	}, [onLoad, ticketFile]);

	// Parsing ticket by ID is done server-side, so we declare an effect to do it
	useEffect(() => {
		(async () => {
			const ticketId = searchParams.get('id');
			if (!ticketId) return;

			const invoiceData = await parseServer(ticketId);
			const invoice = parseInvoiceData(invoiceData);
			onLoad(invoice);
		})();
	}, [onLoad, searchParams]);

	return <p>Loading…</p>;
};

export default TicketLoad;
