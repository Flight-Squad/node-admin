import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';
import { FlightSearch, FlightSearchQueryFields } from './search';
import { Queue } from '../queue';
import { TripScraperQuery } from './scraper';
// import { createFlightSquadDebugger } from '../debugger';

// const debug = createFlightSquadDebugger('customer');

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

    // TODO link searches and transactions
}

export interface CustomerSearches {
    [id: string]: unknown;
}

export interface CustomerMessagingIds {
    /** Map messaging platforms the user uses to their ids on that platform */
    [platform: string]: string;
}

export class Customer extends FirestoreObject implements CustomerFields {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly dob: string;
    readonly stripe: string;
    readonly searches: CustomerSearches;
    readonly messaging: CustomerMessagingIds;
    static readonly Collection = Firebase.Collections.Customers;
    collection = (): string => Customer.Collection;

    /**
     * Starts a search for the query
     * @param query
     * @param queue To handle long-running jobs
     * @param meta Where and how the query was made
     */
    async requestSearch(
        query: FlightSearchQueryFields,
        queue: Queue<TripScraperQuery>,
        meta: { session: string; platform: string },
    ): Promise<Customer> {
        let search = await FlightSearch.make(query, { ...meta, customer: this.id }, this.db).createDoc();
        search = await search.start(queue);
        return this.addSearch(search);
    }

    /**
     * Adds record of search to customer info
     * @param search
     */
    addSearch(search: FlightSearch): Promise<Customer> {
        this.searches[search.id] = {};
        return this.updateDoc({ searches: this.searches }, Customer);
    }

    /**
     * Returns a customer with unique id and empty fields
     *
     * Does ***not*** add customer database
     * @param db
     */
    static createNewCustomer(db: Firebase): Customer {
        // TODO implement
        return new Customer({
            id: '',
            firstName: '',
            lastName: '',
            dob: '',
            stripe: '',
            searches: {},
            db,
        });
    }

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
    static async fromMessaging(db: Firebase, platform: string, id: string): Promise<Customer> {
        const customerQuery = await db.firestore
            .collection(Customer.Collection)
            .where(`messaging.${platform}`, '==', id)
            .get();
        if (customerQuery.empty) {
            return new Customer({
                id: '',
                firstName: '',
                lastName: '',
                dob: '',
                stripe: '',
                db,
                messaging: {
                    [platform]: id,
                },
                searches: {},
            });
        }
        // Customer is first doc that matches platform id
        return db.find(Customer.Collection, customerQuery.docs[0].id, Customer);
    }

    constructor(props: CustomerFields) {
        super(props);
    }
}
