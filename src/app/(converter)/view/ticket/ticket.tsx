import { FunctionComponent } from 'react';

import { Ticket } from '../../ticket.model';
import TicketData from './data/ticket-data';
import TicketImage from './image/ticket-image';
import styles from './ticket.module.scss';

const TicketComponent: FunctionComponent<{ data: Ticket }> = ({ data }) => (
	<article className={styles.container}>
		<TicketData data={data} className={styles.data} />
		<TicketImage data={data.image} className={styles.image} alt="Original ticket scan" />
	</article>
);

export default TicketComponent;
