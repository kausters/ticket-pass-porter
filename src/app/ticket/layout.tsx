import { PropsWithChildren } from 'react';

import { TicketUploadProvider } from './ticket-upload-context';

export default function TicketLayout({ children }: PropsWithChildren) {
	return <TicketUploadProvider>{children}</TicketUploadProvider>;
}
