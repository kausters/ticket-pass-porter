import { XMLParser } from 'fast-xml-parser';

import { Event, EventsRequest, EventsResponse } from './events.model';
import { EVENTS_API_URL, FC_AREA } from './load.model';

export async function getEventByTitle(
	title: string,
): Promise<Event | undefined> {
	const eventsResponse = await requestEvents();
	const { events } = await parseEventsResponse(eventsResponse);

	return events.find((event) => event.title === title);
}

function requestEvents(): Promise<Response> {
	const cacheTime = 60 * 60 * 24; // 24 hours

	const queryParams: EventsRequest = { area: FC_AREA, includeVideos: false };
	const searchParams: Record<string, string> = Object.fromEntries(
		Object.entries(queryParams).map(([key, value]) => [key, value.toString()]),
	);

	const url = new URL(EVENTS_API_URL);
	url.search = new URLSearchParams(searchParams).toString();

	return fetch(url, {
		next: { revalidate: cacheTime },
	});
}

async function parseEventsResponse(
	response: Response,
): Promise<EventsResponse> {
	const tagNameMap: Record<string, string> = { ID: 'id' };

	const parser = new XMLParser({
		ignoreAttributes: true,
		ignoreDeclaration: true,
		parseTagValue: false,
		parseAttributeValue: false,
		processEntities: false,

		// Convert tags from PascalCase to camelCase
		transformTagName(name) {
			return tagNameMap[name] || name[0].toLowerCase() + name.slice(1);
		},
	});

	const text = await response.text();
	const parsed = parser.parse(text);

	// For some reason, it puts Event items into an events.event property. Must be using it wrong.
	parsed.events = parsed.events.event;
	return parsed;
}
