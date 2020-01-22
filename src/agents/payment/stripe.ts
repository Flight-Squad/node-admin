import stripe from 'stripe';
import { CustomerManager } from '../../crm/interface';
import { CustomerIdentifiers } from '../../flightsquad';
import { Chargable, PaymentFields } from '../../payment/interface';

export class Stripe implements CustomerManager, Chargable {
    charge = Stripe.charge;
    createCustomer = Stripe.createCustomer;

    static readonly client = (apiKey: string) => new stripe(apiKey, { apiVersion: '2019-12-03', typescript: true });

    static readonly updateDefaultSource = (customer: string, source: string, stripe: stripe) => stripe.customers.update(customer, {
        default_source: source
    });

    /**
     * Creates a Stripe customer
     */
    static readonly createCustomer = async (customer: CustomerIdentifiers, stripe: stripe, options?: { metadata?: unknown, source?: string, description?: string, phone?: string }) => {
        const { email, firstName, lastName } = customer;
        let params = {
            email,
            name: `${firstName} ${lastName}`,
        }; { }
        params = Object.assign(params, options);
        return stripe.customers.create(params);
    }

    static readonly charge = (config: PaymentFields, stripe: stripe) => {
        const params = Object.assign({}, config);
        // usd is default currency
        params.currency = params.currency || 'usd';
        return stripe.charges.create(params);
    }
}
