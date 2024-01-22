import { FunctionComponent } from 'react';

import { Ticket } from '../../ticket.model';
import styles from './ticket.module.scss';
import TicketData from './ticket-data';
import TicketImage from './ticket-image';

const TicketComponent: FunctionComponent<{ data: Ticket }> = ({ data }) => (
	<article className={styles.container}>
		<TicketData data={data}></TicketData>
		<TicketImage data={data.image} alt="Biļetes oriģināls"></TicketImage>
	</article>
);

export default TicketComponent;
