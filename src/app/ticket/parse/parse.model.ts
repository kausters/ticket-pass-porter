import { Ticket, TicketInvoice } from '../ticket.model';
import { TicketInvoiceLoadData } from './markus/load/load.model';
import { TicketInvoiceReadData } from './markus/read/read.model';
import { Scan } from './markus/scan/scan.model';

export type TicketParseData = Omit<Ticket, 'image'> & {
	image: Scan['image'];
};

export type TicketInvoiceParseData = Omit<TicketInvoice, 'tickets'> & {
	tickets: TicketParseData[];
};

export interface TicketInvoiceParseResults {
	readResults: TicketInvoiceReadData;
	loadResults?: TicketInvoiceLoadData;
	scanResults?: Scan[];
}
