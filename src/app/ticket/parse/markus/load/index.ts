import { DateTime } from 'luxon';

import { TicketInvoiceReadData } from '../read/read.model';
import { getEvent } from './events';
import { EXTRA_DURATION, TicketInvoiceLoadData } from './load.model';
import { getShow } from './schedule';

export type { TicketInvoiceLoadData } from './load.model';

export async function load(
	readData: TicketInvoiceReadData,
): Promise<TicketInvoiceLoadData> {
	const ticket = readData.tickets[0];
	const event = await getEvent(ticket.name);

	// Could not find event, so we don't have duration or end time data
	if (!event) return {};

	const start = DateTime.fromISO(ticket.start);
	const show = await getShow(event, start);

	// Could not find show, return event duration
	if (!show) {
		const duration = event.lengthInMinutes + EXTRA_DURATION;
		const end = start.plus({ minutes: duration }).toISO();
		return end ? { end } : {};
	}

	// Found show, return its actual end time
	const end = DateTime.fromISO(show.dttmShowEndUTC).toISO();
	return end ? { end } : {};
}
