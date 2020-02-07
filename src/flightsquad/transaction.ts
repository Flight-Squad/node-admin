import { FirestoreObject, FirestoreObjectConfig, Firebase } from '../agents';
import { Database } from '../database';
import { CustomerIdentifiers } from './customer';
import { TransactionStatus, Trip } from '@flight-squad/common';
import nanoid from 'nanoid';

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
        this.id = props.id || this.generateId();
        this.db = props.db || Transaction.defaultDb;
    }

    // 139 yrs at avg 1k/ids/sec until statistcally significant chance of collision
    // https://zelark.github.io/nano-id-cc/
    generateId = (): string => nanoid(11);

    collection = (): string => Transaction.Collection;
    static find(db: Firebase, id: string): Promise<Transaction> {
        return db.find(Transaction.Collection, id, Transaction);
    }
    find = (id: string): Promise<Transaction> => Transaction.find(this.db, id);
}
