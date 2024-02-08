'use client';

import { FunctionComponent } from 'react';

import { TicketInvoice } from '../ticket.model';
import InvoiceCalendar from './invoice-calendar';
import Ticket from './ticket/ticket';
import styles from './view.module.scss';

interface Props {
	invoice: TicketInvoice;
}

const TicketView: FunctionComponent<Props> = ({ invoice }) => {
	return (
		<div>
			<h1>Invoice #{invoice.id}</h1>
			<InvoiceCalendar invoice={invoice} />

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
