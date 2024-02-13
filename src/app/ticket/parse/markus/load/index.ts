import { DateTime } from 'luxon';

import { TicketInvoiceReadData } from '../read/read.model';
import { getEvent } from './events';
import { EXTRA_DURATION, TicketInvoiceLoadData } from './load.model';
import { getShow } from './schedule';

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
		const endTime = start.plus({ minutes: duration });
		const end = processTime(endTime).toISO();
		return end ? { end } : {};
	}

	// Found show, return its actual end time
	const endTime = DateTime.fromISO(show.dttmShowEndUTC);
	const end = processTime(endTime).toISO();
	return end ? { end } : {};
}

/**
 * For some reason, the API data often has Event durations and Show end times
 * ending with "6" minutes. That's nasty on tickets and in calendar, so
 * we round the calculated end time to the nearest 5 minutes.
 */
function processTime(time: DateTime): DateTime {
	const minutes = time.minute;
	const roundedMinutes = Math.round(minutes / 5) * 5;
	return time.set({ minute: roundedMinutes });
}
