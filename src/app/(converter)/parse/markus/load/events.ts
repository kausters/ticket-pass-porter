import { XMLParser } from 'fast-xml-parser';

import { Event, EventsRequest, EventsResponse } from './events.model';
import { EVENTS_API_URL, FC_AREA } from './load.model';

export async function getEvent(title: string): Promise<Event | undefined> {
	try {
		const eventsResponse = await requestEvents();
		const { events } = await parseEventsResponse(eventsResponse);

		return events.find((event) => event.title === title);
	} catch (error) {
		console.error('Failed to get event', error);
		return undefined;
	}
}

function requestEvents(): Promise<Response> {
	const queryParams: EventsRequest = { area: FC_AREA, includeVideos: false };
	const searchParams: Record<string, string> = Object.fromEntries(
		Object.entries(queryParams).map(([key, value]) => [key, value.toString()]),
	);

	const url = new URL(EVENTS_API_URL);
	url.search = new URLSearchParams(searchParams).toString();

	const cacheTime = 60 * 60 * 24; // 24 hours
	return fetch(url, { next: { revalidate: cacheTime } });
}

async function parseEventsResponse(
	response: Response,
): Promise<EventsResponse> {
	const tagNameMap: Record<string, string> = { ID: 'id' };
	const arrays = ['events.event'];

	const parser = new XMLParser({
		ignoreAttributes: true,
		ignoreDeclaration: true,
		parseTagValue: false,
		parseAttributeValue: false,
		processEntities: false,

		isArray: (name, path) => arrays.includes(path),

		// Convert tags from PascalCase to camelCase
		transformTagName(name) {
			return tagNameMap[name] || name[0].toLowerCase() + name.slice(1);
		},
	});

	const text = await response.text();
	const parsed = parser.parse(text);

	if (!parsed.events?.event) {
		// No events found
		return { events: [] };
	}

	// For some reason, it puts Event items into an events.event property. Must be using it wrong.
	parsed.events = parsed.events.event;

	(parsed as EventsResponse).events.forEach((event) => {
		// Normally wouldn't modify the object in place, but didn't want to bother deep-cloning each item for each step
		cleanEvent(event);
		parseEvent(event);
	});

	return parsed;
}

function cleanEvent(event: Event): Event {
	// Remove keys with empty values
	Object.entries(event)
		.filter(([, value]) => value === '')
		.forEach(([key]) => delete event[key as keyof Event]);

	return event;
}

function parseEvent(event: Event): Event {
	// Event actually is now just strings, but TypeScript doesn't know that
	const data = event as unknown as Record<keyof Event, string>;

	event.lengthInMinutes = parseInt(data.lengthInMinutes, 10);
	event.productionYear = parseInt(data.productionYear, 10);

	return event;
}
