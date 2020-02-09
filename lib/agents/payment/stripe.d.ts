import stripe from 'stripe';
import { CustomerManager } from '../../crm/interface';
import { CustomerIdentifiers } from '../../flightsquad';
import { Chargable, PaymentFields } from '../../payment/interface';
export declare class Stripe implements CustomerManager, Chargable {
    charge: (config: PaymentFields, stripe: stripe) => Promise<stripe.Charge>;
    createCustomer: (customer: CustomerIdentifiers, stripe: stripe, options?: {
        metadata?: unknown;
        source?: string;
        description?: string;
        phone?: string;
    }) => Promise<stripe.Customer>;
    static readonly client: (apiKey: string) => stripe;
    static readonly updateDefaultSource: (customer: string, source: string, stripe: stripe) => Promise<stripe.Customer>;
    /**
     * Creates a Stripe customer
     */
    static readonly createCustomer: (customer: CustomerIdentifiers, stripe: stripe, options?: {
        metadata?: unknown;
        source?: string;
        description?: string;
        phone?: string;
    }) => Promise<stripe.Customer>;
    static readonly createSource: (stripe: stripe, customerId: string, token: string) => Promise<stripe.CustomerSource>;
    /**
     * 3 ways to create a charge: https://stackoverflow.com/a/34416413
     *
     * 1. `source` only
     *
     * 2. `customer` only
     *
     * 3. `customer` and `source` -> `source` must be linked to `customer`
     */
    static readonly charge: (config: PaymentFields, stripe: stripe) => Promise<stripe.Charge>;
}
