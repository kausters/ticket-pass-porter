import { XMLParser } from 'fast-xml-parser';
import { DateTime } from 'luxon';

import { Event } from './events.model';
import { SCHEDULE_API_URL } from './load.model';
import { ScheduleRequest, ScheduleResponse, Show } from './schedule.model';

export async function getShow(
	event: Event,
	ticketStart: DateTime,
): Promise<Show | undefined> {
	try {
		const scheduleResponse = await requestSchedule(event.id, ticketStart);
		const { schedule } = await parseScheduleResponse(scheduleResponse);

		return schedule.shows.find((show) => {
			const showStart = DateTime.fromISO(show.dttmShowStartUTC);
			return ticketStart.equals(showStart);
		});
	} catch (error) {
		console.error('Failed to get show', error);
		return undefined;
	}
}

async function requestSchedule(
	eventId: string,
	start: DateTime,
): Promise<Response> {
	const queryParams: ScheduleRequest = {
		eventID: eventId,
		dt: start.toFormat('dd.MM.yyyy'),
	};

	const searchParams: Record<string, string> = Object.fromEntries(
		Object.entries(queryParams).map(([key, value]) => [key, value.toString()]),
	);

	const url = new URL(SCHEDULE_API_URL);
	url.search = new URLSearchParams(searchParams).toString();

	const cacheTime = 60 * 60 * 24; // 24 hours
	return fetch(url, { next: { revalidate: cacheTime } });
}

async function parseScheduleResponse(
	response: Response,
): Promise<ScheduleResponse> {
	const tagNameMap: Record<string, string> = { ID: 'id' };
	const arrays = ['schedule.shows.show'];

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

	if (!parsed.schedule?.shows) {
		// No shows found
		return {
			schedule: {
				pubDate: '',
				shows: [] as Show[],
			},
		};
	}

	// For some reason, it puts Show items into an shows.show property. Must be using it wrong.
	parsed.schedule.shows = parsed.schedule.shows.show;

	(parsed as ScheduleResponse).schedule.shows.forEach((show) => {
		// Normally wouldn't modify the object in place, but didn't want to bother deep-cloning each item for each step
		cleanShow(show);
		parseShow(show);
	});

	return parsed;
}

function cleanShow(show: Show): Show {
	// Remove keys with empty values
	Object.entries(show)
		.filter(([, value]) => value === '')
		.forEach(([key]) => delete show[key as keyof Show]);

	return show;
}

function parseShow(show: Show): Show {
	// Show actually is now just strings, but TypeScript doesn't know that
	const data = show as unknown as Record<keyof Show, string>;

	show.lengthInMinutes = parseInt(data.lengthInMinutes, 10);
	show.productionYear = parseInt(data.productionYear, 10);

	return show;
}
