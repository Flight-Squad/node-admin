import { FirestoreObject, FirestoreObjectConfig } from '../agents';
import { CustomerIdentifiers } from './customer';
import { TransactionStatus, Trip } from '@flight-squad/common';
export interface TransactionFields extends FirestoreObjectConfig {
    status: TransactionStatus;
    amount: number;
    customer: CustomerIdentifiers;
    trip: Trip;
}
/**
 * Make a transaction and use it to send follow up message to customer
 */
export declare class Transaction extends FirestoreObject implements TransactionFields {
    readonly status: TransactionStatus;
    readonly amount: number;
    readonly customer: CustomerIdentifiers;
    readonly trip: Trip;
    static readonly Collection: string;
    private static readonly defaultDb;
    constructor(props: TransactionFields);
    collection: () => string;
}
