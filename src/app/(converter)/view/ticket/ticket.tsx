import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';

import { Ticket } from '../../ticket.model';
import TicketData from './data/ticket-data';
import TicketImage from './image/ticket-image';
import styles from './ticket.module.scss';

const TicketComponent: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	const [showOriginal, setShowOriginal] = useState(false);
	const [hasRendered, setHasRendered] = useState(false);

	function handleToggleOriginal() {
		setShowOriginal(!showOriginal);
		if (!hasRendered && !showOriginal) {
			setHasRendered(true);
		}
	}

	return (
		<article className={styles.container}>
			<div className={clsx(styles.ticket, showOriginal && styles.showOriginal)}>
				<TicketData data={data} className={styles.data} />
				{(showOriginal || hasRendered) && (
					<TicketImage
						data={data.image}
						className={clsx(styles.image, !showOriginal && styles.hidden)}
						alt="Original ticket scan"
					/>
				)}
			</div>

			<menu className={styles.menu}>
				<button onClick={handleToggleOriginal}>Show original</button>
			</menu>
		</article>
	);
};

export default TicketComponent;
