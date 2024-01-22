'use client';

import { FunctionComponent } from 'react';

import Ticket from './ticket/ticket';
import styles from './ticket-view.module.scss';
import { TicketInvoice } from './tickets.model';

interface Props {
	invoice: TicketInvoice;
}

const TicketView: FunctionComponent<Props> = ({ invoice }) => {
	return (
		<div>
			<h1>Invoice #{invoice.id}</h1>

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
