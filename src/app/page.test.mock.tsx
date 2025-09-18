import { jest } from '@jest/globals';

import mockComponent from '../lib/mock/mock-component';
import { Converter } from './ticket/converter';

export const converterMock = mockComponent<typeof Converter>();
jest.mock('./ticket/converter', () => ({ Converter: converterMock }));
