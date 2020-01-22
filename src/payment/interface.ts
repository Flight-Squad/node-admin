export interface Chargable {
    charge(config: PaymentFields): void | Promise<void> | never | Promise<never>;
}

export interface PaymentFields {
    amount: number;
    /** Customer ID */
    customer: string;
    /** Payment Token - Could be object or a string */
    source?: unknown;
    currency?: string;
}