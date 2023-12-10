import { DateTime } from 'luxon';

export interface TicketInvoice {
	id: string;
	tickets: Ticket[];
}

export interface Ticket {
	id: string;
	type: string;
	name: string;
	rating: string;

	auditorium: string;
	section: string;
	row: number;
	seat: number;

	start: DateTime;
	purchased: DateTime;
	price: number;
	detail: string;
}
