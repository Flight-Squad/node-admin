import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';

export interface CustomerFields extends FirestoreObjectConfig {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    email?: string;
    /** stripe customer id */
    stripe: string;
    messaging?: CustomerMessagingIds;

    // TODO link searches and transactions
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
    readonly messaging: CustomerMessagingIds;
    collection = (): string => Firebase.Collections.Customers;

    static createNewCustomer(): Customer {
        // TODO implement
        return null;
    }
}
