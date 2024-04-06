import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';

import { configure } from '@testing-library/dom';

configure({
	// `data-testid` is barbaric, use `data-test-id` instead
	testIdAttribute: 'data-test-id',
});
