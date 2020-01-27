import { Firebase, FirestoreObject, FirestoreObjectConfig } from '../agents/firebase';
import { Queue } from '../queue';
import { TripScraperQuery } from './scraper';
import { Trip, FlightStops } from '@flight-squad/common';
export { FlightStops };
export declare enum FlightSearchStatus {
    Requested = 0,
    InProgress = 1,
    Halted = 2,
    Done = 3,
    Error = 4
}
export interface FlightSearchMeta {
    /** session id */
    session: string;
    /** customer id */
    customer: string;
    /**
     * Messaging platform
     *
     * Used with customer (via customer id) to respond and send follow up messages
     */
    platform: string;
}
export interface FlightSearchFields extends FirestoreObjectConfig, FlightSearchQueryFields {
    status: FlightSearchStatus;
    meta: FlightSearchMeta;
}
export interface FlightSearchQueryFields {
    origins: string[];
    dests: string[];
    departDates: string[] | Date[];
    returnDates?: string[] | Date[];
    isRoundTrip: boolean;
    stops: string | number | FlightStops;
}
/**
 * Immutable object representing a flight search
 */
export declare class FlightSearch extends FirestoreObject implements FlightSearchFields {
    readonly origins: string[];
    readonly dests: string[];
    readonly departDates: string[] | Date[];
    readonly returnDates: string[] | Date[];
    readonly isRoundTrip: boolean;
    readonly status: FlightSearchStatus;
    readonly stops: string | number | FlightStops;
    readonly numTrips: number;
    readonly meta: FlightSearchMeta;
    readonly tripGroups: string[];
    private static readonly db;
    static readonly Collection: string;
    collection: () => string;
    static find(db: Firebase, id: string): Promise<FlightSearch>;
    find(id: string): Promise<FlightSearch>;
    constructor(props: FlightSearchFields);
    /**
     * Creates a Flight Search
     *
     * Does not write to db
     * @param query
     * @param meta
     * @param db
     */
    static make(query: FlightSearchQueryFields, meta: FlightSearchMeta, db: Firebase): FlightSearch;
    /**
     * Pre-Condition: this search has been added to database
     *
     * Step 1: Start search for flights
     * @param queue Queue to add scraping requests to
     */
    start(queue: Queue<TripScraperQuery>): Promise<FlightSearch>;
    /**
     * Step 2:
     * Mark each trip group as complete
     * @param id id of trip group to add to list of completed trip groups
     */
    completeTripGroup(id: string): Promise<FlightSearch>;
    /**
     * Step 3: Check if search has completed
     */
    isDone(): boolean;
    /**
     * Step 4: Update status
     * @param status
     */
    updateStatus(status: FlightSearchStatus): Promise<FlightSearch>;
    /**
     * Step 5: Get best trip from search results and make a transaction with it
     */
    bestTrip(): Promise<Trip>;
    private createTripGroups;
    private tripQueries;
}
