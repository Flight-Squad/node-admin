import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';
import { FlightStops, FlightSearch } from './search';
import { Queue } from '../queue';
import { TripScraperQuery } from './scraper';
import { Trip, SearchProviders } from '@flight-squad/common';
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
export declare enum TripGroupProcStatus {
    /** Waiting in Queue */
    Waiting = 0,
    /** Currently being processed */
    InProgress = 1,
    /** Processing Canceled */
    Cancelled = 2,
    /** All conditions and subcomponents of the TripGroup have been satisfied:
     *
     * - Each search provider was scraped
     */
    Done = 3
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
export declare class TripGroup extends FirestoreObject implements TripGroupFields {
    readonly query: TripGroupQuery;
    readonly status: TripGroupProcStatus;
    readonly providers: TripGroupProviders;
    readonly searchId: string;
    private static readonly defaultDb;
    static readonly Collection: string;
    static readonly SortPriceAsc: (a: Trip, b: Trip) => number;
    collection: () => string;
    static find(db: Firebase, id: string): Promise<TripGroup>;
    find(id: string): Promise<TripGroup>;
    constructor(props: TripGroupFields);
    /**
     * Step 1: Start scraping trips
     * @param queue
     */
    startScraping(queue: Queue<TripScraperQuery>): Promise<TripGroup>;
    /**
     * Step 2: Add provider results
     * @param provider
     * @param results
     */
    addProvider(provider: SearchProviders, results: ProviderResults): Promise<TripGroup>;
    /**
     * Step 3: Check for completion
     */
    isDone(): boolean;
    /**
     * Step 4: Mark Trip Group as finished
     *
     * Returns the `FlightSearch` that this trip group is a part of
     *
     * Returns `null` if the trip group isn't done yet.
     */
    finish(): Promise<FlightSearch>;
    updateStatus: (status: TripGroupProcStatus) => Promise<TripGroup>;
    sortByPriceAsc(): Array<Trip>;
    bestTrip: () => Trip;
    bestTripFrom(provider: SearchProviders | string): Trip;
    benchmarkTrip(): Trip;
}
