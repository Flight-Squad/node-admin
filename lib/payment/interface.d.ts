export interface Chargable {
    charge(config: PaymentFields, ...args: any[]): any;
}
export interface PaymentFields {
    amount: number;
    /** Customer ID */
    customer: string;
    /** Payment Token */
    source?: string;
    currency?: string;
}
