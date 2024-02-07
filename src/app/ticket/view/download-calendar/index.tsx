import { createEvent, EventAttributes } from 'ics';

const DownloadCalendar = () => {
	function getEventAttributes(): EventAttributes {
		return {
			start: [2024, 1, 1, 0, 0],
			duration: { hours: 3 },
		};
	}

	async function getCalendarEvent() {
		const filename = 'invoice';
		const event = getEventAttributes();
		const data = await getCalendarData(event);
		console.log(data);

		const file = new File([data], `${filename}.ics`, { type: 'text/calendar' });
		downloadFile(file);
	}

	return <button onClick={getCalendarEvent}>Calendar</button>;
};

export default DownloadCalendar;

async function getCalendarData(event: EventAttributes) {
	return new Promise<string>((resolve, reject) => {
		createEvent(event, (error, value) => {
			if (error) reject(error);
			else resolve(value);
		});
	});
}

function downloadFile(file: File) {
	const url = URL.createObjectURL(file);

	// Creates an anchor element and fake-clicks it for a clean download
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = file.name;

	document.body.appendChild(anchor);
	anchor.click();

	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}
