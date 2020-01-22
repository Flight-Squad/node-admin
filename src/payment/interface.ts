export interface Chargable {
    charge(config: PaymentFields, ...args);
}

export interface PaymentFields {
    amount: number;
    /** Customer ID */
    customer: string;
    /** Payment Token */
    source?: string;
    currency?: string;
}
