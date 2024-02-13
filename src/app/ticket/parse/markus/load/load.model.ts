const API_URL = 'https://www.forumcinemas.lv/xml/';
export const EVENTS_API_URL = API_URL + 'Events/';
export const SCHEDULE_API_URL = API_URL + 'Schedule/';

/** Area value for Forum Cinemas */
export const FC_AREA = 1011;

/**
 * Extra time (in minutes) for duration to account for trailers etc.
 * The API returns the real time for {@link dttmShowEnd} but not for
 * {@link lengthInMinutes}, which is the length of the actual event.
 */
export const EXTRA_DURATION = 20;

export interface TicketInvoiceLoadData {
	end?: string;
}
