export const enum EventListType {
	NowInTheatres = 'NowInTheatres',
	ComingSoon = 'ComingSoon',
}

export interface EventsRequest {
	/** Event List Type (Optional, defaults to {@link NowInTheatres} */
	listType?: EventListType;

	/** Theatre Area ID (Optional, defaults to ALL areas. When {@link listType}={@link ComingSoon}, area has no effect.) */
	area?: number;

	/** Event ID (Optional, defaults to ALL events. When specified, {@link listType} and {@link area} have no effect.) */
	eventID?: number;

	/** Include videos in event details (Optional, defaults to true) */
	includeVideos?: boolean;

	/** Include web links in event details (Optional, defaults to false) */
	includeLinks?: boolean;

	/** Include gallery in event details (Optional, defaults to false) */
	includeGallery?: boolean;

	/** Include all picture resources (except gallery) in event details (Optional, defaults to false) */
	includePictures?: boolean;
}

export interface EventsResponse {
	events: Event[];
}

export interface Event {
	id: string;
	title: string;
	originalTitle: string;
	productionYear: number;
	lengthInMinutes: number;
	dtLocalRelease: string;
	rating: string;
	ratingLabel: string;
	ratingImageUrl: string;
	localDistributorName: string;
	globalDistributorName: string;
	productionCompanies: string;
	eventType: string;
	genres: string;
	shortSynopsis: string;
	synopsis: string;
	eventURL: string;
	images: EventImages;
	videos: EventVideos;
	links: EventLinks;
	pictures: EventPictures;
	gallery: GalleryImages;
	cast: Person[];
	directors: Person[];
	contentDescriptors?: any[];
}

interface EventImages {
	eventMicroImagePortrait: string;
	eventSmallImagePortrait: string;
	eventMediumImagePortrait: string;
	eventLargeImagePortrait: string;
}

interface EventVideos {
	eventVideo: EventVideo[];
}

interface EventVideo {
	title: string;
	location: string;
	thumbnailLocation?: string;
	mediaResourceSubType: string;
	mediaResourceFormat: string;
}

interface EventLinks {
	link: EventLink[];
}

interface EventLink {
	title: string;
	location: string;
	linkType: string;
}

interface EventPictures {
	picture: EventPicture[];
}

interface EventPicture {
	title: string;
	location: string;
	pictureType: string;
}

interface GalleryImages {
	galleryImage: GalleryImage[];
}

interface GalleryImage {
	title?: string;
	location: string;
	thumbnailLocation: string;
}

interface Person {
	firstName: string;
	lastName: string;
}
