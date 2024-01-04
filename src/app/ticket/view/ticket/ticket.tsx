import { FunctionComponent } from 'react';
import { Ticket } from '../tickets.model';

const ticket: FunctionComponent<{ data: Ticket }> = ({ data }) => {
	return (
		<div>
			<p>id: {data.id}</p>
		</div>
	);
};

export default ticket;
