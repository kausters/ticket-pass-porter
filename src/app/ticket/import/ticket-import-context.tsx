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
interface TicketImportContextValue {
	ticketFile: File | undefined;
	setTicketFile: Dispatch<SetStateAction<File | undefined>>;
}

// Create a context with an undefined initial value
const ticketImportContext = createContext<TicketImportContextValue | undefined>(
	undefined,
);

// Custom hook for using the ticket import context
export function useTicketImport() {
	const context = useContext(ticketImportContext);

	assert(
		context && Object.keys(context).length > 0,
		'useTicketImport must be used within a TicketImportProvider',
	);

	return context;
}

// TicketImportProvider component
export function TicketImportProvider({ children }: PropsWithChildren) {
	const [ticketFile, setTicketFile] = useState<File | undefined>(undefined);
	const Provider = ticketImportContext.Provider;
	return <Provider value={{ ticketFile, setTicketFile }}>{children}</Provider>;
}
