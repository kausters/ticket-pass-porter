import { FunctionComponent } from 'react';
import { Ticket } from '../tickets.model';
import styles from './ticket.module.scss';

const ticket: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	return (
		<article className={styles.container}>
			<div className={styles.top}>
				<div className={styles.topLeft}>
					<h2>Biļete</h2>

					<p className={styles.auditorium}>{data.auditorium}</p>
					<p className={styles.section}>{data.section}</p>
					<p className={styles.type}>{data.type}</p>
				</div>

				<div className={styles.topCode}>
					<img
						src="https://via.placeholder.com/150"
						width={150}
						height={150}
						alt={data.id}
					/>
					<small className={styles.id}>{data.id}</small>
				</div>
			</div>

			<h3 className={styles.name}>{data.name}</h3>
			<small className={styles.rating}>{data.rating}</small>

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
