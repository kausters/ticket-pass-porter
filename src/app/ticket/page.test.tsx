import './page.test.mock';

import { describe, it } from '@jest/globals';
import { render } from '@testing-library/react';

import TicketPage from './page';

describe('TicketPage', () => {
	it('renders', async () => {
		const result = render(<TicketPage />);
		result.debug();
	});
});
