import './page.test.mock';

import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';

import TicketPage from './page';
import { importMock, loadMock, useSearchPramsMock, viewMock } from './page.test.mock';

describe('TicketPage', () => {
	describe('Import', () => {
		it('renders Import if no file or ID is present', () => {
			// Import is rendered by default so we don't need to mock anything extra
			importMock.mockReturnValue(<div data-test-id="import" />);
			const { getByTestId } = render(<TicketPage />);

			// Expect Import to be rendered
			expect(importMock).toHaveBeenCalled();
			expect(getByTestId('import')).toBeInTheDocument();
		});
	});

	describe('Load', () => {
		it('renders Load with ID from search params', () => {
			// Mock the search params to return an ID, which should render Load
			useSearchPramsMock.get.mockImplementation((key) => (key === 'id' ? '1' : null));

			loadMock.mockReturnValue(<div data-test-id="load" />);
			const { getByTestId } = render(<TicketPage />);

			// Expect Load to be rendered with the ID from the search params
			expect(loadMock).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), {});
			expect(getByTestId('load')).toBeInTheDocument();
		});

		it('renders Load with file from Import', () => {
			// Mock the Import component to call onImport with a file, which should render Load
			const file = new File([], 'tickets.pdf');
			importMock.mockImplementation(({ onImport }) => <button onClick={() => onImport(file)} />);

			loadMock.mockReturnValue(<div data-test-id="load" />);
			const { getByRole, getByTestId } = render(<TicketPage />);

			// Click the Import button to trigger the file import
			const importButton = getByRole('button');
			fireEvent.click(importButton);

			// Expect Load to be rendered with the file from Import
			expect(loadMock).toHaveBeenCalledWith(expect.objectContaining({ file }), {});
			expect(getByTestId('load')).toBeInTheDocument();
		});
	});

	describe('View', () => {
		it('renders View with invoice from Load', () => {
			// Mock the search params to return an ID, which should render Load
			useSearchPramsMock.get.mockImplementation((key) => (key === 'id' ? '1' : null));

			// Mock the Load component to call onLoad with an invoice, which should render View
			const invoice = { id: '1', tickets: [] };
			loadMock.mockImplementation(({ onLoad }) => <button onClick={() => onLoad(invoice)} />);

			viewMock.mockReturnValue(<div data-test-id="view" />);
			const { getByRole, getByTestId } = render(<TicketPage />);

			// Click the Load button to trigger the invoice load
			const loadButton = getByRole('button');
			fireEvent.click(loadButton);

			// Expect View to be rendered with the invoice from Load
			expect(viewMock).toHaveBeenCalledWith(expect.objectContaining({ invoice }), {});
			expect(getByTestId('view')).toBeInTheDocument();
		});
	});
});
