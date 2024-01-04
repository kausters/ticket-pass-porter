import { FunctionComponent } from 'react';
import { Ticket } from '../tickets.model';
import styles from './ticket.module.scss';

const ticket: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	return (
		<div className={styles.ticket}>
			<p>id: {data.id}</p>
		</div>
	);
};

export default ticket;
