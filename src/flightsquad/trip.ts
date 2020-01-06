import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';
import { FlightStops } from './search';
import { Database } from '../database';

interface TripQuery {
    origin: string;
    dest: string;
    departDate: string | Date;
    returnDate?: string | Date;
    isRoundTrip: boolean;
    stops: FlightStops | string | number;
}

interface TripProviders {
    [searchProvider: string]: ProviderResults;
}

/** Interface for results from scraper */
export interface ProviderResults {
    /** Data scraped from Url */
    data: ProviderData[];
    /** Url that was scraped */
    url: string;
}

export interface ProviderData {
    airline: string;
    duration: string;
    layovers: string[]; // Tentative
    price: number;
    stops: FlightStops | string | number;
    times: string | string[]; // Tentative -- map airport to times{arrival, depart}?
    /** Search Provider (aka scraping module) */
    provider: SearchProviders;
}

/** Processing Status */
enum TripProcStatus {
    /** Waiting in Queue */
    Waiting,
    /** Currently being processed */
    InProgress,
    /** Processing Canceled */
    Cancelled,
    /** All conditions and subcomponents of the Trip have been satisfied:
     *
     * - Each search provider was scraped
     */
    Done,
}

/** Search Providers enabled
 *
 * Key is scraper module
 *
 * Value is key of scraper results in Trip object
 */
export enum SearchProviders {
    GoogleFlights = 'google',
}

export interface TripFields extends FirestoreObjectConfig {
    query: TripQuery;
    status: TripProcStatus;
    providers: TripProviders;
}

export class Trip extends FirestoreObject implements TripFields {
    readonly query: TripQuery;
    readonly status: TripProcStatus;
    readonly providers: TripProviders;

    private readonly comparePriceAsc = (a, b) => a.price - b.price;

    private static readonly defaultDb = Database.firebase;
    private static readonly Collection = Firebase.Collections.Trips;

    constructor(props: TripFields) {
        super(props);
        this.db = props.db || Trip.defaultDb;
    }

    collection = (): string => Trip.Collection;

    isDone(): boolean {
        const tripProviders = Object.keys(this.providers);
        const searchProviders = Object.keys(SearchProviders);

        // Each Search Provider has been scraped
        return searchProviders.every(prov => tripProviders.includes(prov));
    }

    // TODO inverse dependency flow for testing? It's 2 AM I might be tripping

    sortByPriceAsc(): Array<ProviderData> {
        // TODO implement
        const options = [];
        // Aggregate all entries
        for (const [, val] of Object.entries(this.providers)) {
            options.push(val.data);
        }
        return options.sort(this.comparePriceAsc);
    }

    bestTrip = (): ProviderData => this.sortByPriceAsc()[0];

    bestTripFrom(provider: SearchProviders): ProviderData {
        return this.providers[provider].data.sort(this.comparePriceAsc)[0];
    }

    benchmarkTrip(): ProviderData {
        // TODO returns lowest google price
        // implement failure case
        return this.bestTripFrom(SearchProviders.GoogleFlights);
    }
}
