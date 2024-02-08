import { createEvent, EventAttributes } from 'ics';
import { DateTime } from 'luxon';
import { FunctionComponent, MouseEventHandler } from 'react';

import { TicketInvoice } from '../../ticket.model';

interface Props {
	invoice: TicketInvoice;
}

const InvoiceCalendar: FunctionComponent<Props> = ({ invoice }) => {
	const getCalendarEvent: MouseEventHandler = async (event) => {
		const filename = `invoice-${invoice.id}`;
		const calEvent = getEventAttributes(invoice);
		const data = await getCalendarData(calEvent);
		if (event.altKey) return console.log(data);

		const file = new File([data], `${filename}.ics`, { type: 'text/calendar' });
		downloadFile(file);
	};

	return <button onClick={getCalendarEvent}>Calendar</button>;
};

export default InvoiceCalendar;

function getEventAttributes(invoice: TicketInvoice): EventAttributes {
	const ticket = invoice.tickets[0];
	const start = DateTime.fromISO(ticket.start);
	const location = invoice.location;

	// https://github.com/adamgibbons/ics?tab=readme-ov-file#api
	return {
		title: ticket.name,
		start: start.toUTC().toMillis(),
		startInputType: 'utc',
		duration: { hours: 3 },
		description: `${ticket.auditorium} - ${ticket.section}`,
		location: location?.name,
		geo: location ? { lat: location.lat, lon: location.lon } : undefined,
	};
}

async function getCalendarData(event: EventAttributes) {
	return new Promise<string>((resolve, reject) => {
		createEvent(event, (error, value) => {
			if (error) reject(error);
			else resolve(value);
		});
	});
}

function downloadFile(file: File) {
	const url = URL.createObjectURL(file);

	// Creates an anchor element and fake-clicks it for a clean download
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = file.name;

	document.body.appendChild(anchor);
	anchor.click();

	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}
