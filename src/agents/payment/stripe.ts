import stripe from 'stripe';
import { CustomerManager } from '../../crm/interface';
import { CustomerIdentifiers } from '../../flightsquad';
import { Chargable, PaymentFields } from '../../payment/interface';

export class Stripe implements CustomerManager, Chargable {
    charge = Stripe.charge;
    createCustomer = Stripe.createCustomer;

    static readonly client = (apiKey: string): stripe =>
        new stripe(apiKey, { apiVersion: '2019-12-03', typescript: true });

    static readonly updateDefaultSource = (
        customer: string,
        source: string,
        stripe: stripe,
    ): Promise<stripe.Customer> =>
        stripe.customers.update(customer, {
            // eslint-disable-next-line @typescript-eslint/camelcase
            default_source: source,
        });

    /**
     * Creates a Stripe customer
     */
    static readonly createCustomer = async (
        customer: CustomerIdentifiers,
        stripe: stripe,
        options?: { metadata?: unknown; source?: string; description?: string; phone?: string },
    ): Promise<stripe.Customer> => {
        const { email, firstName, lastName } = customer;
        let params = {
            email,
            name: `${firstName} ${lastName}`,
        };
        params = Object.assign(params, options);
        return stripe.customers.create(params);
    };

    static readonly createSource = (
        stripe: stripe,
        customerId: string,
        token: string,
    ): Promise<stripe.CustomerSource> => stripe.customers.createSource(customerId, { source: token });

    /**
     * 3 ways to create a charge: https://stackoverflow.com/a/34416413
     *
     * 1. `source` only
     *
     * 2. `customer` only
     *
     * 3. `customer` and `source` -> `source` must be linked to `customer`
     */
    static readonly charge = (config: PaymentFields, stripe: stripe): Promise<stripe.Charge> => {
        const params = Object.assign({}, config);
        // usd is default currency
        params.currency = params.currency || 'usd';
        return stripe.charges.create(params);
    };
}
