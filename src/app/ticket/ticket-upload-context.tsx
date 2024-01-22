'use client';

import React, {
	createContext,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { assert } from 'ts-essentials';

// Define the type for the context value
interface TicketUploadContextValue {
	ticketFile: File | undefined;
	setTicketFile: Dispatch<SetStateAction<File | undefined>>;
}

// Create a context with an undefined initial value
const TicketUploadContext = createContext<TicketUploadContextValue | undefined>(
	undefined,
);

// Custom hook for using the ticket upload context
export function useTicketUpload() {
	const context = useContext(TicketUploadContext);
	assert(context, 'useTicketUpload must be used within a TicketUploadProvider');

	return context;
}

// TicketUploadProvider component
export function TicketUploadProvider({ children }: PropsWithChildren) {
	const [ticketFile, setTicketFile] = useState<File | undefined>(undefined);
	const Provider = TicketUploadContext.Provider;
	return <Provider value={{ ticketFile, setTicketFile }}>{children}</Provider>;
}
