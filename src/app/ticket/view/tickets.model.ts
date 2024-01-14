export interface TicketInvoice {
	id: string;
	tickets: Ticket[];
}

export interface Ticket {
	code: string;
	type: string;
	name: string;
	rating: string;

	auditorium: string;
	section: string;
	row: number;
	seat: number;

	start: string;
	purchased: string;
	price: number;
	detail: string;

	image?: ImageData;
}
