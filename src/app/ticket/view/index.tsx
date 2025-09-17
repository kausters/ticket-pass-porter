'use client';

import { FunctionComponent } from 'react';

import { TicketInvoice } from '../ticket.model';
import InvoiceCalendar from './invoice-calendar';
import Ticket from './ticket/ticket';
import styles from './view.module.scss';

interface Props {
	invoice: TicketInvoice;
	importedFile?: File;
}

const TicketView: FunctionComponent<Props> = ({ invoice, importedFile }) => {
	return (
		<div>
			<h1>Invoice #{invoice.id}</h1>
			<InvoiceCalendar invoice={invoice} importedFile={importedFile} />

			<ul className={styles.tickets}>
				{invoice.tickets.map((ticket) => (
					<li key={ticket.code}>
						<Ticket data={ticket} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default TicketView;
