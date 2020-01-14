import { FirebaseDoc, Firebase } from '../agents';

export interface Airport {
    /** The city the airport is in */
    city: string;
    /** iata code of airport */
    code: string;
    /** Public name of the airport */
    name: string;
}

export interface IataMapper {
    iatas(...args): string[] | Promise<string[]>;
}

export interface AirportMapper {
    airports(...args): Airport[] | Promise<Airport[]>;
}

/**
 * Maps a location to a comma separated list of airport iata codes
 */
export class AirportLocMap extends FirebaseDoc implements IataMapper {
    constructor(docId: string, sheetName: string, db: Firebase) {
        super(`${docId}/${sheetName}`, db);
    }

    iatas = (location: string): string[] =>
        this.loaded() && this.data[location]
            ? // Filter out empty items
              this.data[location].airports.split(',').filter(item => item)
            : [];
}
