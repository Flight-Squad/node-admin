import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';
import { FlightStops, FlightSearch } from './search';
import { Database } from '../database';
import { Airport } from './airport';
import { Queue } from '../queue';
import { TripScraperQuery } from './scraper';
import { createFlightSquadDebugger } from '../debugger';

const debug = createFlightSquadDebugger('trip');

export interface TripGroupFields extends FirestoreObjectConfig {
    query: TripGroupQuery;
    status: TripGroupProcStatus;
    providers: TripGroupProviders;
    /** The search this Trip Group belongs to */
    searchId: string;
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
    readonly searchId: string;

    private static readonly defaultDb = Database.firebase;

    static readonly Collection = Firebase.Collections.TripGroups;
    static readonly SortPriceAsc = (a: Trip, b: Trip): number => a.price - b.price;

    collection = (): string => TripGroup.Collection;

    constructor(props: TripGroupFields) {
        super(props);
        this.db = props.db || TripGroup.defaultDb;
        debug('Instantiated Trip Group %O', this.data());
    }

    /**
     * Step 1: Start scraping trips
     * @param queue
     */
    async startScraping(queue: Queue<TripScraperQuery>): Promise<TripGroup> {
        const tripsToScrape: TripScraperQuery[] = [];
        for (const [, provider] of Object.entries(SearchProviders)) {
            tripsToScrape.push({
                ...this.query,
                provider,
                group: this.id,
            });
        }
        await queue.pushAll(tripsToScrape);
        return this.updateStatus(TripGroupProcStatus.InProgress);
    }

    /**
     * Step 2: Add provider results
     * @param provider
     * @param results
     */
    addProvider(provider: SearchProviders, results: ProviderResults): Promise<TripGroup> {
        return this.updateDoc({ providers: { [provider]: results } }, TripGroup);
    }

    /**
     * Step 3: Check for completion
     */
    isDone(): boolean {
        const TripGroupProviders = Object.keys(this.providers);
        const searchProviders = Object.keys(SearchProviders);

        // Each Search Provider has been scraped
        return searchProviders.every(prov => TripGroupProviders.includes(prov));
    }

    /**
     * Step 4: Mark Trip Group as finished
     *
     * Returns the `FlightSearch` that this trip group is a part of
     *
     * Returns `null` if the trip group isn't done yet.
     */
    async finish(): Promise<FlightSearch> {
        if (this.isDone()) {
            // Update Status
            await this.updateStatus(TripGroupProcStatus.Done);
            // Mark as finished in parent search
            const search = await this.db.find(FlightSearch.Collection, this.searchId, FlightSearch);
            return search.completeTripGroup(this.id);
        }
        return null;
    }

    updateStatus = (status: TripGroupProcStatus): Promise<TripGroup> => this.updateDoc({ status }, TripGroup);

    // CONSIDER inverse dependency flow for testing?
    sortByPriceAsc(): Array<Trip> {
        const options = [];
        // Aggregate all entries
        for (const [, val] of Object.entries(this.providers)) {
            options.push(val.data);
        }
        return options.sort(TripGroup.SortPriceAsc);
    }

    bestTrip = (): Trip => this.sortByPriceAsc()[0];

    bestTripFrom(provider: SearchProviders): Trip {
        return this.providers[provider].data.sort(TripGroup.SortPriceAsc)[0];
    }

    benchmarkTrip(): Trip {
        // TODO implement failure case
        // returns lowest google price
        return this.bestTripFrom(SearchProviders.GoogleFlights);
    }
}
