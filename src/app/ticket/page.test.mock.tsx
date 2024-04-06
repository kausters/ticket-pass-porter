import { jest } from '@jest/globals';

jest.mock('next/navigation', () => ({
	useSearchParams: () => ({
		get: jest.fn(() => null),
	}),
}));

jest.mock('./import', () => () => <div role="Import" />);
jest.mock('./load', () => () => <div role="Load" />);
jest.mock('./view', () => () => <div role="View" />);
