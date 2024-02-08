import type { TicketInvoice } from '../../../ticket.model';

const defaultLocation: Required<TicketInvoice>['location'] = {
	name: 'Forum Cinemas\n13. janvāra iela 8, Riga 1050, Latvia',
	lat: 56.946112,
	lon: 24.116259,
};

export function getInvoiceId(data: string[]): string {
	const invoiceIdIndex = 1;
	return data[invoiceIdIndex];
}

export function getLocation(): TicketInvoice['location'] {
	return defaultLocation;
}

export function getCalendarEventData() {
	return [
		// Rich location data for Apple Maps
		`X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-APPLE-MAPKIT-HANDLE=CAESlgIIrk0Q2buKlIP/qOXeARoSCTQtsTIaeUxAEZzdWibDHThAImMKB0xhdHZpamESAkxWGgVSxKtnYTIFUsSrZ2E6B0xWLTEwNTBCEk1hc2thdmFzIGZvcsWhdGF0ZVIRMTMuIGphbnbEgXJhIGllbGFaAThiEzEzLiBqYW52xIFyYSBpZWxhIDgqDUZvcnVtIENpbmVtYXMyEzEzLiBqYW52xIFyYSBpZWxhIDgyDlLEq2dhLCBMVi0xMDUwMgdMYXR2aWphOC9QAVpMCiUI2buKlIP/qOXeARISCTQtsTIaeUxAEZzdWibDHThAGK5NkAMBoh8iCNm7ipSD/6jl3gEaFQoNRm9ydW0gQ2luZW1hcxAAKgJsdg==;X-APPLE-RADIUS=141.1752677235263;X-APPLE-REFERENCEFRAME=1;X-TITLE="${defaultLocation.name}":geo:${defaultLocation.lat},${defaultLocation.lon}`,
	];
}
