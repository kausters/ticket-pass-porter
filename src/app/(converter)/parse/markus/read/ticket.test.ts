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

	describe('show-info table (mapped by column position)', () => {
		/* The header reading order is [time, date, row, seat] while the value
		reading order is [row, seat, time, date], so a naive zip would mis-map.
		These tickets also have wrapped titles, so the values are index-shifted too —
		both are only correct when read by x-column. */

		it('maps row/seat/time/date by column despite a wrapped title', () => {
			const ticket = parseTicket(multiLineTitleTicket);
			expect(ticket.row).toBe(7);
			expect(ticket.seat).toBe(12);
			expect(DateTime.fromISO(ticket.start).toFormat('yyyy-MM-dd HH:mm')).toBe('2026-07-10 19:30');
		});

		it('maps the second wrapped-title ticket correctly', () => {
			const ticket = parseTicket(multiLineTitleTicket2);
			expect(ticket.row).toBe(8);
			expect(ticket.seat).toBe(13);
			expect(DateTime.fromISO(ticket.start).toFormat('yyyy-MM-dd HH:mm')).toBe('2026-08-20 19:30');
		});

		it('still reads the single-line ticket table correctly', () => {
			const ticket = parseTicket(singleLineTicket);
			expect(ticket.row).toBe(9);
			expect(ticket.seat).toBe(13);
		});
	});

	describe('detail block', () => {
		it('reads the disclaimer from a single-line ticket', () => {
			const ticket = parseTicket(singleLineTicket);
			expect(ticket.detail).toContain('Lūdzam saglabāt biļeti līdz seansa beigām.');
			expect(ticket.detail).toContain('Aizliegts ienest ārpus k/t');
		});

		it('reads the disclaimer without including the wrapped title', () => {
			const ticket = parseTicket(multiLineTitleTicket);
			expect(ticket.detail).toContain('Paldies par pirkumu!');
			expect(ticket.detail).not.toContain('Gredzenu');
			expect(ticket.detail).not.toContain('EUR');
		});
	});
});
