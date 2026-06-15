import { describe, expect, it } from '@jest/globals';
import { DateTime } from 'luxon';

import { parseTicket } from './ticket';
import { singleLineTicket } from './ticket.test.fixtures';

describe('parseTicket', () => {
	describe('single text-item title', () => {
		const ticket = parseTicket(singleLineTicket);

		it('reads the title, type and rating', () => {
			expect(ticket.name).toBe('Atklāšanas diena');
			expect(ticket.type).toBe('Kino Guru');
			expect(ticket.rating).toBe('Līdz 12 g.v. - neiesakām');
		});

		it('reads the seating row and seat', () => {
			expect(ticket.row).toBe(9);
			expect(ticket.seat).toBe(13);
		});

		it('reads the start date and time', () => {
			const start = DateTime.fromISO(ticket.start);
			expect(start.toFormat('yyyy-MM-dd HH:mm')).toBe('2026-06-11 19:00');
		});
	});
});
