import { describe, expect, it } from '@jest/globals';
import { DateTime } from 'luxon';

import { parseTicket } from './ticket';
import { multiLineTitleTicket, multiLineTitleTicket2, singleLineTicket } from './ticket.test.fixtures';

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

	describe('title wrapped across multiple text items', () => {
		it('joins a title that wraps before a "(year)" suffix', () => {
			const ticket = parseTicket(multiLineTitleTicket);
			expect(ticket.name).toBe('Gredzenu pavēlnieks: Gredzena brālība (2001)');
			expect(ticket.type).toBe('Kino Guru');
			expect(ticket.rating).toBe('Līdz 12 g.v. - neiesakām');
		});

		it('joins a title that wraps mid-sentence', () => {
			const ticket = parseTicket(multiLineTitleTicket2);
			expect(ticket.name).toBe('Terminators 2. Pastarā diena *Pagarinātā versija* (1991)');
			expect(ticket.type).toBe('Kino Guru');
		});
	});
});
