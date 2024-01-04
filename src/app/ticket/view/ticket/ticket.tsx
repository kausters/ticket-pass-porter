import { FunctionComponent } from 'react';
import { Ticket } from '../tickets.model';
import styles from './ticket.module.scss';

const ticket: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	return (
		<article className={styles.container}>
			<p>id: {data.id}</p>
			<p>title: {data.type}</p>
			<p>name: {data.name}</p>
			<p>rating: {data.rating}</p>
			<p>auditorium: {data.auditorium}</p>
			<p>section: {data.section}</p>
			<p>row: {data.row}</p>
			<p>seat: {data.seat}</p>
			<p>start: {data.start}</p>
			<p>purchased: {data.purchased}</p>
			<p>price: {data.price}</p>
			<p>detail: {data.detail}</p>
		</article>
	);
};

export default ticket;
