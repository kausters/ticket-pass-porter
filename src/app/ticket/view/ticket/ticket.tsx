import { DateTime } from 'luxon';
import { FunctionComponent } from 'react';
import { Ticket } from '../tickets.model';
import styles from './ticket.module.scss';

const ticket: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	const start = DateTime.fromISO(data.start);

	return (
		<article className={styles.container}>
			<div className={styles.top}>
				<div className={styles.topLeft}>
					<h2 className={styles.title}>Biļete</h2>

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
					<p className={styles.id}>{data.id}</p>
				</div>
			</div>

			<h3 className={styles.name}>{data.name}</h3>
			<p className={styles.rating}>{data.rating}</p>

			<table className={styles.visit}>
				<thead>
					<tr>
						<th>Rinda</th>
						<th>Vietas</th>
						<th>Seansa laiks</th>
						<th>Seansa datums</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{data.row}</td>
						<td>{data.seat}</td>
						<td>{start.toFormat('HH:mm')}</td>
						<td>{start.toFormat('dd.MM')}</td>
					</tr>
				</tbody>
			</table>

			<p>purchased: {data.purchased}</p>
			<p>price: {data.price}</p>
			<p>detail: {data.detail}</p>
		</article>
	);
};

export default ticket;
