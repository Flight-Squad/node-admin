import { FirebaseDoc, Firebase } from '../agents';
import { Airport } from '@flight-squad/common';
export interface IataMapper {
    iatas(...args: any[]): string[] | Promise<string[]>;
}
export interface AirportMapper {
    airports(...args: any[]): Airport[] | Promise<Airport[]>;
}
/**
 * Maps a location to a comma separated list of airport iata codes
 */
export declare class AirportLocMap extends FirebaseDoc implements IataMapper {
    constructor(docId: string, sheetName: string, db: Firebase);
    iatas: (location: string) => string[];
}
