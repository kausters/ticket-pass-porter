import { XMLParser } from 'fast-xml-parser';

import { Events, EventsRequest } from './events.model';
import { EVENTS_API_URL, FC_AREA } from './load.model';

const cacheTime = 60 * 60 * 24; // 24 hours

const tagNameMap: Record<string, string> = {
	ID: 'id',
};

export async function getEventByTitle(title: string): Promise<Event> {
	// Get events from the API
	const eventsResponse = await requestEvents();
	const events = await parseEventsResponse(eventsResponse);
	console.log(events);

	return {} as Event;
}

function requestEvents(): Promise<Response> {
	const queryParams: EventsRequest = { area: FC_AREA };
	const searchParams: Record<string, string> = Object.fromEntries(
		Object.entries(queryParams).map(([key, value]) => [key, value.toString()]),
	);

	const url = new URL(EVENTS_API_URL);
	url.search = new URLSearchParams(searchParams).toString();

	return fetch(url, {
		next: { revalidate: cacheTime },
	});
}

async function parseEventsResponse(response: Response): Promise<Events> {
	const parser = new XMLParser({
		ignoreDeclaration: true,
		parseTagValue: false,
		parseAttributeValue: false,
		processEntities: false,

		// Convert tags from PascalCase to camelCase
		transformTagName: (name) =>
			tagNameMap[name] || name[0].toLowerCase() + name.slice(1),
	});

	const text = await response.text();
	return parser.parse(text);
}
