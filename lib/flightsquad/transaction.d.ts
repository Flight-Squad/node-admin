import { FirestoreObject, FirestoreObjectConfig } from '../agents';
import { Trip } from './trip';
import { Customer } from './customer';
export interface TransactionFields extends FirestoreObjectConfig {
    status: TransactionStatus;
    amount: number;
    customer: Customer;
    trip: Trip;
}
declare enum TransactionStatus {
    Created = 0,
    Pending = 1,
    Processed = 2,
    Failed = 3
}
/**
 * Make a transaction and use it to send follow up message to customer
 */
export declare class Transaction extends FirestoreObject implements TransactionFields {
    readonly status: TransactionStatus;
    readonly amount: number;
    readonly customer: Customer;
    readonly trip: Trip;
    private static readonly defaultDb;
    constructor(props: TransactionFields);
    collection: () => string;
}
export {};
