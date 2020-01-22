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
    static readonly client: (apiKey: string, config: stripe.StripeConfig) => stripe;
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
    static readonly charge: (config: PaymentFields, stripe: stripe) => Promise<stripe.Charge>;
}
