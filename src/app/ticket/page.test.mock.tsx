import { jest } from '@jest/globals';
import { useSearchParams } from 'next/navigation';

import mockComponent from '../../lib/mock/mock-component';
import TicketImport from './import';
import TicketLoad from './load';
import TicketView from './view';

export const useSearchPramsMock: Pick<jest.Mocked<ReturnType<typeof useSearchParams>>, 'get'> = {
	get: jest.fn(() => null),
};

jest.mock('next/navigation', () => ({
	useSearchParams: () => useSearchPramsMock,
}));

export const importMock = mockComponent<typeof TicketImport>();
jest.mock('./import', () => importMock);

export const loadMock = mockComponent<typeof TicketLoad>();
jest.mock('./load', () => loadMock);

export const viewMock = mockComponent<typeof TicketView>();
jest.mock('./view', () => viewMock);
