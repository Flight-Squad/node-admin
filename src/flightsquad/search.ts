import { Firebase, FirestoreObject, FirestoreObjectConfig } from '../agents/firebase';
import { Database } from '../database';
import { Queue } from '../queue';
import { TripGroup, TripGroupQuery, TripGroupProcStatus } from './trip';
import { TripScraperQuery } from './scraper';
import { createFlightSquadDebugger } from '../debugger';
import { Trip, FlightStops } from '@flight-squad/common';
// import path from 'path';

const debug = createFlightSquadDebugger('search');

export { FlightStops };

export enum FlightSearchStatus {
    Requested,
    InProgress,
    Halted,
    Done,
    Error,
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
export class FlightSearch extends FirestoreObject implements FlightSearchFields {
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

    private static readonly db = Database.firebase;

    static readonly Collection = Firebase.Collections.Searches;
    collection = (): string => FlightSearch.Collection;

    static find(db: Firebase, id: string): Promise<FlightSearch> {
        return db.find(FlightSearch.Collection, id, FlightSearch);
    }

    find(id: string): Promise<FlightSearch> {
        return FlightSearch.find(this.db, id);
    }

    constructor(props: FlightSearchFields) {
        super(props);
        this.db = props.db || FlightSearch.db;
        this.returnDates = this.returnDates || []; // To avoid leaving returnDates undefined
        this.tripGroups = this.tripGroups || [];
        this.numTrips =
            this.origins.length * this.dests.length * this.departDates.length * (this.returnDates.length || 1);
    }

    /**
     * Creates a Flight Search
     *
     * Does not write to db
     * @param query
     * @param meta
     * @param db
     */
    static make(query: FlightSearchQueryFields, meta: FlightSearchMeta, db: Firebase): FlightSearch {
        return new FlightSearch({
            ...query,
            db,
            id: '', // autogenerate
            status: FlightSearchStatus.Requested,
            meta,
        });
    }

    /**
     * Pre-Condition: this search has been added to database
     *
     * Step 1: Start search for flights
     * @param queue Queue to add scraping requests to
     */
    async start(queue: Queue<TripScraperQuery>): Promise<FlightSearch> {
        // Enqueue all scraping requests
        const tripGroups = await Promise.all(this.createTripGroups());
        await Promise.all(tripGroups.map(async group => group.startScraping(queue)));
        // Update status and tripGroups
        return this.updateDoc({ status: FlightSearchStatus.InProgress }, FlightSearch);
    }

    /**
     * Step 2:
     * Mark each trip group as complete
     * @param id id of trip group to add to list of completed trip groups
     */
    completeTripGroup(id: string): Promise<FlightSearch> {
        this.tripGroups.push(id);
        debug('completing trip %o', { trip: id, tripGroups: this.tripGroups });
        return this.updateDoc({}, FlightSearch);
    }

    /**
     * Step 3: Check if search has completed
     */
    isDone(): boolean {
        return this.tripGroups.length === this.numTrips;
    }

    /**
     * Step 4: Update status
     * @param status
     */
    updateStatus(status: FlightSearchStatus): Promise<FlightSearch> {
        return this.updateDoc({ status }, FlightSearch);
    }

    /**
     * Step 5: Get best trip from search results and make a transaction with it
     */
    async bestTrip(): Promise<Trip> {
        const tripGroups = await Promise.all(
            this.tripGroups.map(id => this.db.find(TripGroup.Collection, id, TripGroup)),
        );
        const bestTrips = tripGroups.map(group => group.bestTrip());
        // return lowest priced trip
        return bestTrips.sort(TripGroup.SortPriceAsc)[0];
    }

    private createTripGroups(): Promise<TripGroup>[] {
        const queries = this.tripQueries();
        return queries.map(query =>
            new TripGroup({
                query,
                status: TripGroupProcStatus.Waiting,
                providers: {},
                searchId: this.id,
                db: this.db,
                id: '', // autogenerate id
            }).createDoc(),
        );
    }

    private tripQueries(): TripGroupQuery[] {
        const groups: TripGroupQuery[] = [];
        for (const origin of this.origins) {
            for (const dest of this.dests) {
                for (const departDate of this.departDates) {
                    groups.push({
                        origin,
                        dest,
                        departDate,
                        isRoundTrip: this.isRoundTrip,
                        stops: this.stops,
                    });
                }
            }
        }
        if (this.returnDates && this.isRoundTrip) {
            const newGroups = [];
            for (const group of groups) {
                for (const returnDate of this.returnDates) {
                    newGroups.push({
                        ...group,
                        returnDate,
                    });
                }
            }
            return newGroups;
        }
        return groups;
    }
}

// TODO: Move to integration test

// const firebase = Firebase.init({
//     firebaseUrl: process.env.FIREBASE_URL,
//     serviceAccount: process.env.FS_CONFIG,
//     serviceAccountPath: path.resolve(__dirname, './serviceAccount.json'),
// });

// const cfg: FlightSearchFields = {
//     origins: ['BWI'],
//     dests: ['BOS'],
//     db: firebase,
//     departDates: [new Date()],
//     isRoundTrip: false,
//     status: FlightSearchStatus.Requested,
//     stops: FlightStops.AnyStops,
//     id: 'test-search-1',
//     coll: 'test_searches',
// };
// const search = new FlightSearch(cfg);
// search.createDoc();
// console.log(JSON.stringify(search.data(), null, 2));
