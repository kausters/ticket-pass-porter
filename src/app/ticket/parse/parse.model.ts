import { Ticket, TicketInvoice } from '../ticket.model';
import { Scan } from './markus/scan/scan.model';

export type TicketParseData = Omit<Ticket, 'image'> & {
	image: Scan['image'];
};

export type TicketInvoiceParseData = Omit<TicketInvoice, 'tickets'> & {
	tickets: TicketParseData[];
};
