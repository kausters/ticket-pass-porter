export interface ScheduleRequest {
	/** Theatre Area ID (Optional, defaults to first in area list) */
	area?: number;

	/** Date (Optional, defaults to today. Format: dd.mm.yyyy, no leading zeroes) */
	dt?: string;

	/** Event ID (Optional, defaults to ALL events) */
	eventID?: string;

	/** Number of days to retrieve (Optional, defaults to 1. Accepted value between 1–31 incl.) */
	days?: number;
}

export interface ScheduleResponse {
	schedule: Schedule;
}

interface Schedule {
	pubDate: string;
	shows: Show[];
}

export interface Show {
	id: string;
	dtAccounting: string;
	dttmShowStart: string;
	dttmShowStartUTC: string;
	dttmShowEnd: string;
	dttmShowEndUTC: string;
	showSalesStartTime: string;
	showSalesStartTimeUTC: string;
	showSalesEndTime: string;
	showSalesEndTimeUTC: string;
	showReservationStartTime: string;
	showReservationStartTimeUTC: string;
	showReservationEndTime: string;
	showReservationEndTimeUTC: string;
	eventId: string;
	title: string;
	originalTitle: string;
	productionYear: number;
	lengthInMinutes: number;
	dtLocalRelease: string;
	rating: string;
	ratingLabel: string;
	ratingImageUrl: string;
	eventType: string;
	genres: string;
	theatreID: string;
	theatreAuditriumID: string;
	theatre: string;
	theatreAuditorium: string;
	theatreAndAuditorium: string;
	presentationMethodAndLanguage: string;
	presentationMethod: string;
	eventSeries: string;
	showURL: string;
	eventURL: string;
	spokenLanguage: ShowLanguage;
	subtitleLanguage1: ShowLanguage;
	subtitleLanguage2: ShowLanguage;
	images: ShowImages;
	contentDescriptors?: any[];
}

interface ShowLanguage {
	name: string;
	nameInLanguage: string;
	isoTwoLetterCode: string;
}

interface ShowImages {
	eventMicroImagePortrait: string;
	eventSmallImagePortrait: string;
	eventMediumImagePortrait: string;
	eventLargeImagePortrait: string;
}
