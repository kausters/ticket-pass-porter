import clsx from 'clsx';
import { DateTime } from 'luxon';
import { FunctionComponent } from 'react';

import { Ticket } from '../../../ticket.model';
import Qr from './qr/qr';
import styles from './ticket-data.module.scss';

interface Props {
	data: Ticket;
	className?: string;
}

const TicketData: FunctionComponent<Props> = ({ data, className }) => {
	const start = DateTime.fromISO(data.start);
	const end = data.end ? DateTime.fromISO(data.end) : null;
	const purchased = DateTime.fromISO(data.purchased);

	return (
		<div className={clsx(styles.container, className)}>
			<div className={styles.top}>
				<div className={styles.topLeft}>
					<h2 className={styles.title}>Biļete</h2>

					<p className={styles.auditorium}>{data.auditorium}</p>
					<p className={styles.section}>{data.section}</p>
					<p className={styles.type}>{data.type}</p>
				</div>

				<div className={styles.topCode}>
					<Qr data={data.code}></Qr>
					<p className={styles.id}>{data.code}</p>
				</div>
			</div>

			<h3 className={styles.name}>{data.name}</h3>
			<p className={styles.rating}>{data.rating}</p>

			<table className={styles.visit}>
				<thead>
					<tr>
						<th>Rinda</th>
						<th>Vieta</th>
						<th>Seansa datums</th>
						<th>Sākums</th>
						{end && <th>Beigas</th>}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{data.row}</td>
						<td>{data.seat}</td>
						<td>{start.toFormat('dd.MM')}</td>
						<td>{start.toFormat('HH:mm')}</td>
						{end && <td>{end.toFormat('HH:mm')}</td>}
					</tr>
				</tbody>
			</table>

			<p className={styles.detail}>{data.detail}</p>

			<footer className={styles.footer}>
				<a href="https://www.forumcinemas.lv/" target="_blank" rel="noreferrer">
					www.forumcinemas.lv
				</a>
				<p>{currencyFormatter.format(data.price / 100)}</p>
				<p>{purchased.toFormat('dd.MM.yyyy HH:mm')}</p>
			</footer>
		</div>
	);
};

export default TicketData;

const currencyFormatter = new Intl.NumberFormat('lv-LV', {
	style: 'currency',
	currency: 'EUR',
});
