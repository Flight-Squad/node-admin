import { FirestoreObject, FirestoreObjectConfig, Firebase } from '../agents';
import { Database } from '../database';
import { Trip } from './trip';
import { CustomerFields } from './customer';

export interface TransactionFields extends FirestoreObjectConfig {
    status: TransactionStatus;
    amount: number;
    // we don't care about the customer's other seraches in a transaction, so we omit that extra data
    customer: Omit<CustomerFields, 'searches'>;
    trip: Trip;
}

export enum TransactionStatus {
    Created,
    Pending,
    Processed,
    Failed,
}

/**
 * Make a transaction and use it to send follow up message to customer
 */
export class Transaction extends FirestoreObject implements TransactionFields {
    readonly status: TransactionStatus;
    readonly amount: number;
    readonly customer: CustomerFields;
    readonly trip: Trip;

    private static readonly defaultDb = Database.firebase;
    constructor(props: TransactionFields) {
        super(props);
        this.db = props.db || Transaction.defaultDb;
    }

    collection = (): string => Firebase.Collections.Transactions;
}
