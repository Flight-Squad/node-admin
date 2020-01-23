import { FirestoreObject, FirestoreObjectConfig, Firebase } from '../agents';
import { Database } from '../database';
import { CustomerIdentifiers } from './customer';
import { TransactionStatus, Trip } from '@flight-squad/common';

export interface TransactionFields extends FirestoreObjectConfig {
    status: TransactionStatus;
    amount: number;
    // we don't care about the customer's other seraches in a transaction, so we omit that extra data
    customer: CustomerIdentifiers;
    trip: Trip;
}

/**
 * Make a transaction and use it to send follow up message to customer
 */
export class Transaction extends FirestoreObject implements TransactionFields {
    readonly status: TransactionStatus;
    readonly amount: number;
    readonly customer: CustomerIdentifiers;
    readonly trip: Trip;
    static readonly Collection = Firebase.Collections.Transactions;

    private static readonly defaultDb = Database.firebase;
    constructor(props: TransactionFields) {
        super(props);
        this.db = props.db || Transaction.defaultDb;
    }

    collection = (): string => Transaction.Collection;
}
