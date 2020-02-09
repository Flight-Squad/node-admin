"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
class Stripe {
    constructor() {
        this.charge = Stripe.charge;
        this.createCustomer = Stripe.createCustomer;
    }
}
exports.Stripe = Stripe;
Stripe.client = (apiKey) => new stripe_1.default(apiKey, { apiVersion: '2019-12-03', typescript: true });
Stripe.updateDefaultSource = (customer, source, stripe) => stripe.customers.update(customer, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    default_source: source,
});
/**
 * Creates a Stripe customer
 */
Stripe.createCustomer = async (customer, stripe, options) => {
    const { email, firstName, lastName } = customer;
    let params = {
        email,
        name: `${firstName} ${lastName}`,
    };
    params = Object.assign(params, options);
    return stripe.customers.create(params);
};
Stripe.createSource = (stripe, customerId, token) => stripe.customers.createSource(customerId, { source: token });
/**
 * 3 ways to create a charge: https://stackoverflow.com/a/34416413
 *
 * 1. `source` only
 *
 * 2. `customer` only
 *
 * 3. `customer` and `source` -> `source` must be linked to `customer`
 */
Stripe.charge = (config, stripe) => {
    const params = Object.assign({}, config);
    // usd is default currency
    params.currency = params.currency || 'usd';
    return stripe.charges.create(params);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FnZW50cy9wYXltZW50L3N0cmlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUs1QixNQUFhLE1BQU07SUFBbkI7UUFDSSxXQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN2QixtQkFBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFxRDNDLENBQUM7O0FBdkRELHdCQXVEQztBQW5EbUIsYUFBTSxHQUFHLENBQUMsTUFBYyxFQUFVLEVBQUUsQ0FDaEQsSUFBSSxnQkFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFFdkQsMEJBQW1CLEdBQUcsQ0FDbEMsUUFBZ0IsRUFDaEIsTUFBYyxFQUNkLE1BQWMsRUFDVSxFQUFFLENBQzFCLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtJQUM5Qix3REFBd0Q7SUFDeEQsY0FBYyxFQUFFLE1BQU07Q0FDekIsQ0FBQyxDQUFDO0FBRVA7O0dBRUc7QUFDYSxxQkFBYyxHQUFHLEtBQUssRUFDbEMsUUFBNkIsRUFDN0IsTUFBYyxFQUNkLE9BQXVGLEVBQy9ELEVBQUU7SUFDMUIsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBQ2hELElBQUksTUFBTSxHQUFHO1FBQ1QsS0FBSztRQUNMLElBQUksRUFBRSxHQUFHLFNBQVMsSUFBSSxRQUFRLEVBQUU7S0FDbkMsQ0FBQztJQUNGLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLENBQUMsQ0FBQztBQUVjLG1CQUFZLEdBQUcsQ0FDM0IsTUFBYyxFQUNkLFVBQWtCLEVBQ2xCLEtBQWEsRUFDaUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBRWxHOzs7Ozs7OztHQVFHO0FBQ2EsYUFBTSxHQUFHLENBQUMsTUFBcUIsRUFBRSxNQUFjLEVBQTBCLEVBQUU7SUFDdkYsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekMsMEJBQTBCO0lBQzFCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUM7SUFDM0MsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUMifQ==