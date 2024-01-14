import { Ticket, TicketInvoice } from '../../../tickets.model';

export type TicketReadData = Omit<Ticket, 'image'>;

export type TicketInvoiceReadData = Omit<TicketInvoice, 'tickets'> & {
	tickets: TicketReadData[];
};
