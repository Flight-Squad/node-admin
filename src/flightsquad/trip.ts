import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';
import { FlightStops } from './search';
import { Database } from '../database';
import { Airport } from './airport';

export interface TripGroupFields extends FirestoreObjectConfig {
    query: TripGroupQuery;
    status: TripGroupProcStatus;
    providers: TripGroupProviders;
}

export interface TripGroupQuery {
    origin: string;
    dest: string;
    departDate: string | Date;
    returnDate?: string | Date;
    isRoundTrip: boolean;
    stops: FlightStops | string | number;
}

/** Processing Status */
export enum TripGroupProcStatus {
    /** Waiting in Queue */
    Waiting,
    /** Currently being processed */
    InProgress,
    /** Processing Canceled */
    Cancelled,
    /** All conditions and subcomponents of the TripGroup have been satisfied:
     *
     * - Each search provider was scraped
     */
    Done,
}

export interface TripGroupProviders {
    [searchProvider: string]: ProviderResults;
}

/** Interface for results from scraper */
export interface ProviderResults {
    /** trips scraped from Url */
    data: Trip[];
    /** Url that was scraped */
    url: string;
}

export interface Trip {
    price: number;
    /** Should be in order of arrival
     *
     * e.g origin should be first stop,
     * destination should be last,
     * with layovers in between
     */
    stops: TripStop[];
    /** Search Provider (aka scraping module) */
    provider: SearchProviders;
}

export interface TripStop {
    stop: Airport;
    operator: string;
    flightNum: string;
    arrivalTime: string;
    departTime: string;
    duration: string;
}

/** Search Providers enabled
 *
 * Key is scraper module
 *
 * Value is key of scraper results in TripGroup object
 */
export enum SearchProviders {
    GoogleFlights = 'google',
}

export class TripGroup extends FirestoreObject implements TripGroupFields {
    readonly query: TripGroupQuery;
    readonly status: TripGroupProcStatus;
    readonly providers: TripGroupProviders;

    private readonly comparePriceAsc = (a, b) => a.price - b.price;

    private static readonly defaultDb = Database.firebase;
    private static readonly Collection = Firebase.Collections.TripGroups;

    constructor(props: TripGroupFields) {
        super(props);
        this.db = props.db || TripGroup.defaultDb;
    }

    collection = (): string => TripGroup.Collection;

    isDone(): boolean {
        const TripGroupProviders = Object.keys(this.providers);
        const searchProviders = Object.keys(SearchProviders);

        // Each Search Provider has been scraped
        return searchProviders.every(prov => TripGroupProviders.includes(prov));
    }

    // CONSIDER inverse dependency flow for testing?
    sortByPriceAsc(): Array<Trip> {
        const options = [];
        // Aggregate all entries
        for (const [, val] of Object.entries(this.providers)) {
            options.push(val.data);
        }
        return options.sort(this.comparePriceAsc);
    }

    bestTrip = (): Trip => this.sortByPriceAsc()[0];

    bestTripFrom(provider: SearchProviders): Trip {
        return this.providers[provider].data.sort(this.comparePriceAsc)[0];
    }

    benchmarkTrip(): Trip {
        // TODO implement failure case

        // returns lowest google price
        return this.bestTripFrom(SearchProviders.GoogleFlights);
    }
}
