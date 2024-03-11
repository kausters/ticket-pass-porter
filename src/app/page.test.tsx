import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import App from './page';

describe('App', () => {
	it('renders main content', () => {
		render(App());

		const main = screen.getByRole('main');
		expect(main).toBeInTheDocument();
	});
});
