import { FirestoreObject, FirestoreObjectConfig, Firebase } from '../agents';
import { Database } from '../database';
import { Trip } from './trip';
import { Customer } from './customer';

export interface TransactionFields extends FirestoreObjectConfig {
    status: TransactionStatus;
    amount: number;
    customer: Customer;
    trip: Trip;
}

enum TransactionStatus {
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
    readonly customer: Customer;
    readonly trip: Trip;
    static readonly Collection = Firebase.Collections.Transactions;

    private static readonly defaultDb = Database.firebase;
    constructor(props: TransactionFields) {
        super(props);
        this.db = props.db || Transaction.defaultDb;
    }

    collection = (): string => Transaction.Collection;
}
