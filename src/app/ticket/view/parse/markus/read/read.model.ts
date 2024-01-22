import { Ticket, TicketInvoice } from '../../../../ticket.model';

export type TicketReadData = Omit<Ticket, 'image'>;

export type TicketInvoiceReadData = Omit<TicketInvoice, 'tickets'> & {
	tickets: TicketReadData[];
};
