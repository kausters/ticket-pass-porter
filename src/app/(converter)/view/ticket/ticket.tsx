import clsx from 'clsx';
import { FunctionComponent, useRef, useState } from 'react';

import { Ticket } from '../../ticket.model';
import TicketData from './data/ticket-data';
import TicketImage from './image/ticket-image';
import infoIcon from './info.svg';
import styles from './ticket.module.scss';

const TicketComponent: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	const [TicketOriginal, showOriginal, handleToggleOriginal] = useTicketOriginal();

	return (
		<article className={styles.container}>
			<div className={clsx(styles.ticket, showOriginal && styles.showOriginal)}>
				<TicketData data={data} className={styles.data} />
				<TicketOriginal data={data.image} className={styles.image} alt="Original ticket scan" />
			</div>

			<menu className={styles.menu}>
				<button onClick={handleToggleOriginal} title="Show original">
					<img src={infoIcon.src} alt="Info" />
				</button>
			</menu>
		</article>
	);
};

export default TicketComponent;

function useTicketOriginal() {
	const [showOriginal, setShowOriginal] = useState(false);
	const hasShownRef = useRef(false);

	function handleToggleOriginal() {
		setShowOriginal(!showOriginal);
		if (!hasShownRef.current && !showOriginal) {
			hasShownRef.current = true;
		}
	}

	const TicketOriginal: typeof TicketImage = (props) => {
		if (!showOriginal && !hasShownRef.current) return null;
		return <TicketImage {...props} />;
	};

	return [TicketOriginal, showOriginal, handleToggleOriginal] as const;
}
