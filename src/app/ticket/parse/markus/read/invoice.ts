import type { TicketInvoice } from '../../../ticket.model';

export function getInvoiceId(data: string[]): string {
	const invoiceIdIndex = 1;
	return data[invoiceIdIndex];
}

export function getLocation(): TicketInvoice['location'] {
	return {
		name: 'Forum Cinemas\n13. janvāra iela 8, Riga 1050, Latvia',
		lat: 56.946161,
		lon: 24.116281,
	};
}
