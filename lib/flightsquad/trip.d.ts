import { FirestoreObjectConfig, FirestoreObject } from '../agents/firebase';
import { FlightStops } from './search';
import { Airport } from './airport';
import { Queue } from '../queue';
import { TripScraperQuery } from './scraper';
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
export declare enum SearchProviders {
    GoogleFlights = "google"
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
     * Step 4: Update status and add to Flight Search
     */
    updateStatus: (status: TripGroupProcStatus) => Promise<TripGroup>;
    sortByPriceAsc(): Array<Trip>;
    bestTrip: () => Trip;
    bestTripFrom(provider: SearchProviders): Trip;
    benchmarkTrip(): Trip;
}
