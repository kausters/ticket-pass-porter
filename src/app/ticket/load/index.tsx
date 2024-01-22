import { FunctionComponent, useEffect, useState } from 'react';

import { TicketInvoice } from '../ticket.model';
import { parse as parseClient } from '../view/parse/client';
import { TicketInvoiceParseData } from '../view/parse/parse.model';
import { parseInvoiceData } from '../view/parse/parse.utils';
import { parse as parseServer } from '../view/parse/server';

interface Props {
	file?: File;
	id?: string;
	onLoad: (invoice: TicketInvoice) => void;
}

const TicketLoad: FunctionComponent<Props> = ({ file, id, onLoad }) => {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			if (!file && !id) return;
			setLoading(true);

			const invoiceData = await parse(file, id);
			const invoice = parseInvoiceData(invoiceData);

			onLoad(invoice);
			setLoading(false);
		})();
	}, [onLoad, file, id]);

	if (loading) {
		return <p>Loading…</p>;
	}
};

export default TicketLoad;

async function parse(
	file?: File,
	id?: string,
): Promise<TicketInvoiceParseData> {
	/* We've already asserted that either file or id is defined but TypeScript
	can't infer that even with another explicit assertion here, so we have to
	fallback id to an empty string, which will never actually be reached. */

	if (file) {
		// Parsing imported ticket is done client-side
		return parseClient(file);
	} else {
		// Parsing ticket by ID is done server-side
		return parseServer(id || '');
	}
}
