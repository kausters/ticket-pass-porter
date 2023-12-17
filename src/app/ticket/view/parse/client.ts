'use client';

import { TicketInvoice } from '../tickets.model';

export async function parse(file: File): Promise<TicketInvoice> {
	console.log(file);

	return {} as TicketInvoice;
}
