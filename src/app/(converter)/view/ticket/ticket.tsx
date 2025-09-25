import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';

import { Ticket } from '../../ticket.model';
import TicketData from './data/ticket-data';
import TicketImage from './image/ticket-image';
import styles from './ticket.module.scss';

const TicketComponent: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	const [showOriginal, TicketOriginal, handleToggleOriginal] = useToggleOriginal();

	return (
		<article className={styles.container}>
			<div className={clsx(styles.ticket, showOriginal && styles.showOriginal)}>
				<TicketData data={data} className={styles.data} />
				<TicketOriginal data={data.image} className={styles.image} alt="Original ticket scan" />
			</div>

			<menu className={styles.menu}>
				<button onClick={handleToggleOriginal}>Show original</button>
			</menu>
		</article>
	);
};

export default TicketComponent;

function useToggleOriginal() {
	const [showOriginal, setShowOriginal] = useState(false);
	const [hasRendered, setHasRendered] = useState(false);

	function handleToggleOriginal() {
		setShowOriginal(!showOriginal);
		if (!hasRendered && !showOriginal) {
			setHasRendered(true);
		}
	}

	const TicketOriginal: typeof TicketImage = (props) => {
		if (!showOriginal && !hasRendered) return null;
		return <TicketImage {...props} />;
	};

	return [showOriginal, TicketOriginal, handleToggleOriginal] as const;
}
