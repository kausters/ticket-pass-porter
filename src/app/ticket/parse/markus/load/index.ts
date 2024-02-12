import { TicketInvoiceReadData } from '../read/read.model';
import { getEventByTitle } from './events';
import { TicketInvoiceLoadData } from './load.model';

export async function load(
	readData: TicketInvoiceReadData,
): Promise<TicketInvoiceLoadData> {
	const ticket = readData.tickets[0];
	return await getEventByTitle(ticket.name);
}
