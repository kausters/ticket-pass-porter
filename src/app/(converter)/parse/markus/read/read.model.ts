import { Ticket, TicketInvoice } from '../../../ticket.model';

/** A single text item from the PDF, with its position on the page. */
export interface Line {
	str: string;
	x: number;
	y: number;
	hasEOL: boolean;
}

export type TicketReadData = Omit<Ticket, 'image'>;

export type TicketInvoiceReadData = Omit<TicketInvoice, 'tickets'> & {
	tickets: TicketReadData[];
};
