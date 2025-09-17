import { createEvents, EventAttributes } from 'ics';
import { DateTime } from 'luxon';
import { unique } from 'radashi';
import { FunctionComponent, MouseEventHandler } from 'react';

import { TicketInvoice } from '../../ticket.model';

interface Props {
	invoice: TicketInvoice;
	originalFile?: File;
}

const InvoiceCalendar: FunctionComponent<Props> = ({ invoice, originalFile }) => {
	const getCalendarEvent: MouseEventHandler = async (event) => {
		const filename = `invoice-${invoice.id}`;
		const calEvents = getEventAttributes(invoice);
		const calData = await getCalendarData(calEvents);
		const data = await appendEventData(calData, invoice.calendarEventData, originalFile);
		if (event.altKey) return console.log(data);

		const file = new File([data], `${filename}.ics`, { type: 'text/calendar' });
		downloadFile(file);
	};

	return <button onClick={getCalendarEvent}>Calendar</button>;
};

export default InvoiceCalendar;

function getEventAttributes(invoice: TicketInvoice): EventAttributes[] {
	const location = invoice.location;
	const locationData = location ? { location: location.name, geo: { lat: location.lat, lon: location.lon } } : {};

	const events: EventAttributes[] = invoice.tickets.map((ticket) => {
		const start = DateTime.fromISO(ticket.start);

		const end = ticket.end ? DateTime.fromISO(ticket.end) : null;
		const endData = end ? { end: end.toUTC().toMillis(), endInputType: 'utc' as const } : { duration: { hours: 3 } };

		// https://github.com/adamgibbons/ics?tab=readme-ov-file#api
		return {
			title: ticket.name,
			start: start.toUTC().toMillis(),
			startInputType: 'utc',
			description: `${ticket.auditorium} - ${ticket.section}`,
			...endData,
			...locationData,
		};
	});

	// Filter out duplicate events (multiple tickets for the same event)
	return unique(events, (event) => JSON.stringify([event.title, event.start, event.location]));
}

async function getCalendarData(events: EventAttributes[]) {
	return new Promise<string>((resolve, reject) => {
		createEvents(events, (error, value) => {
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

async function appendEventData(calendarData: string, eventData?: string[], attachmentFile?: File) {
	let modifiedData = calendarData;

	// Add custom event data if provided
	if (eventData?.length) {
		const escapedEventData = eventData.map((line) => line.replace(/\n/g, '\\n')).join('\n');
		modifiedData = modifiedData.replace(/END:VEVENT/g, `${escapedEventData}\nEND:VEVENT`);
	}

	// Add file attachment if provided
	if (attachmentFile) {
		const base64Data = await fileToBase64(attachmentFile);
		const attachmentProperty = `ATTACH;FMTTYPE=${attachmentFile.type};ENCODING=BASE64;VALUE=BINARY;SIZE=${attachmentFile.size};X-APPLE-FILENAME=${attachmentFile.name}:${base64Data}`;
		modifiedData = modifiedData.replace(/END:VEVENT/g, `${attachmentProperty}\nEND:VEVENT`);
	}

	return modifiedData;
}

function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			// Remove the data URL prefix (e.g., "data:application/pdf;base64,")
			const base64 = result.split(',')[1];
			resolve(base64);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
