import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';
import { FlightSearch, FlightSearchQueryFields } from './search';
import { Queue } from '../queue';
import { TripScraperQuery } from './scraper';
export interface CustomerFields extends FirestoreObjectConfig {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    email?: string;
    /** stripe customer id */
    stripe: string;
    searches: CustomerSearches;
    messaging?: CustomerMessagingIds;
}
export interface CustomerSearches {
    [id: string]: unknown;
}
export interface CustomerMessagingIds {
    /** Map messaging platforms the user uses to their ids on that platform */
    [platform: string]: string;
}
export declare class Customer extends FirestoreObject implements CustomerFields {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly dob: string;
    readonly stripe: string;
    readonly searches: CustomerSearches;
    readonly messaging: CustomerMessagingIds;
    static readonly Collection: string;
    collection: () => string;
    /**
     * Starts a search for the query
     * @param query
     * @param queue To handle long-running jobs
     * @param meta Where and how the query was made
     */
    requestSearch(query: FlightSearchQueryFields, queue: Queue<TripScraperQuery>, meta: {
        session: string;
        platform: string;
    }): Promise<Customer>;
    /**
     * Adds record of search to customer info
     * @param search
     */
    addSearch(search: FlightSearch): Promise<Customer>;
    /**
     * Returns a customer with unique id and empty fields
     *
     * Does ***not*** add customer database
     * @param db
     */
    static createNewCustomer(db: Firebase): Customer;
    /**
     * Finds a customer based on messaging platform and id.
     *
     * If no existing customer is found, an object representing a new customer is returned
     *
     * Does not write to `db`.
     * @param db
     * @param platform
     * @param id
     */
    static fromMessaging(db: Firebase, platform: string, id: string): Promise<Customer>;
    constructor(props: CustomerFields);
}
