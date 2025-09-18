import { jest } from '@jest/globals';

import mockComponent from '../lib/mock/mock-component';
import { Converter } from './(converter)/converter';

export const converterMock = mockComponent<typeof Converter>();
jest.mock('./(converter)/converter', () => ({ Converter: converterMock }));
