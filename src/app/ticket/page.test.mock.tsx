import { jest } from '@jest/globals';
import { useSearchParams } from 'next/navigation';

import TicketImport from './import';
import TicketLoad from './load';
import TicketView from './view';

export const useSearchPramsMock: Pick<jest.Mocked<ReturnType<typeof useSearchParams>>, 'get'> = {
	get: jest.fn(() => null),
};

jest.mock('next/navigation', () => ({
	useSearchParams: () => useSearchPramsMock,
}));

export const importMock: jest.Mocked<typeof TicketImport> = jest.fn(() => <></>);
jest.mock('./import', () => importMock);

export const loadMock: jest.Mocked<typeof TicketLoad> = jest.fn(() => <></>);
jest.mock('./load', () => loadMock);

export const viewMock: jest.Mocked<typeof TicketView> = jest.fn(() => <></>);
jest.mock('./view', () => viewMock);
