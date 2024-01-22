import { FunctionComponent, useEffect, useState } from 'react';

import { TicketInvoice } from '../ticket.model';
import { parse as parseClient } from '../view/parse/client';
import { parseInvoiceData } from '../view/parse/parse.utils';
import { parse as parseServer } from '../view/parse/server';

interface Props {
	file?: File;
	id?: string;
	onLoad: (invoice: TicketInvoice) => void;
}

const TicketLoad: FunctionComponent<Props> = ({ file, id, onLoad }) => {
	const [loading, setLoading] = useState(false);

	// Parsing uploaded ticket is done client-side, so we just do it and update the state after
	useEffect(() => {
		(async () => {
			if (!file) return;
			setLoading(true);

			const invoiceData = await parseClient(file);
			const invoice = parseInvoiceData(invoiceData);

			onLoad(invoice);
			setLoading(false);
		})();
	}, [onLoad, file]);

	// Parsing ticket by ID is done server-side, so we declare an effect to do it
	useEffect(() => {
		(async () => {
			if (!id) return;
			setLoading(true);

			const invoiceData = await parseServer(id);
			const invoice = parseInvoiceData(invoiceData);

			onLoad(invoice);
			setLoading(false);
		})();
	}, [onLoad, id]);

	return loading && <p>Loading…</p>;
};

export default TicketLoad;
