import { FirestoreObject, FirestoreObjectConfig } from '../agents/firebase';
import { Queue } from '../queue';
import { Trip } from './trip';
import { TripScraperQuery } from './scraper';
export declare enum FlightStops {
    NonStop = 0,
    OneStop = 1,
    AnyStops = 2
}
export declare enum FlightSearchStatus {
    Requested = 0,
    InProgress = 1,
    Halted = 2,
    Done = 3
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
export interface FlightSearchFields extends FirestoreObjectConfig {
    origins: string[];
    dests: string[];
    departDates: string[] | Date[];
    returnDates?: string[] | Date[];
    isRoundTrip: boolean;
    status: FlightSearchStatus;
    stops: string | number | FlightStops;
    meta: FlightSearchMeta;
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
    private static readonly Collection;
    collection: () => string;
    constructor(props: FlightSearchFields);
    /**
     * Step 1:
     * Start search for flights
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
