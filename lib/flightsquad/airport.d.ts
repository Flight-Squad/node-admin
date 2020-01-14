import { FirebaseDoc, Firebase } from '../agents';
export interface Airport {
    /** The city the airport is in */
    city: string;
    /** iata code of airport */
    code: string;
    /** Public name of the airport */
    name: string;
}
/**
 * Maps a location to a comma separated list of airport iata codes
 */
export declare class AirportLocMap extends FirebaseDoc {
    constructor(docId: string, sheetName: string, db: Firebase);
    findIatas: (location: string) => string[];
}
