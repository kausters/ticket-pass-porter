import { PropsWithChildren } from 'react';

import { TicketImportProvider } from './import/ticket-import-context';

export default function TicketLayout({ children }: PropsWithChildren) {
	return <TicketImportProvider>{children}</TicketImportProvider>;
}
