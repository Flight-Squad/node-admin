import { Firebase, FirestoreObject, FirestoreObjectConfig } from '../agents/firebase';
import { Database } from '../database';
// import path from 'path';

export enum FlightStops {
    NonStop,
    OneStop,
    AnyStops,
}

export enum FlightSearchStatus {
    Requested,
    InProgress,
    Halted,
    Done,
}

export interface FlightSearchFields extends FirestoreObjectConfig {
    origins: string[];
    dests: string[];
    departDates: string[] | Date[];
    returnDates?: string[] | Date[];
    isRoundTrip: boolean;
    status: FlightSearchStatus;
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

    // TODO: Refactor: switch to dependency injection
    private static readonly db = Database.firebase;

    private static readonly Collection = Firebase.Collections.Searches;

    constructor(props: FlightSearchFields) {
        super(props);
        this.db = props.db || FlightSearch.db;
    }

    collection = (): string => FlightSearch.Collection;
}

// TODO: Remove

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
