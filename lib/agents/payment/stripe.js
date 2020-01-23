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
    default_source: source
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
Stripe.charge = (config, stripe) => {
    const params = Object.assign({}, config);
    // usd is default currency
    params.currency = params.currency || 'usd';
    return stripe.charges.create(params);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FnZW50cy9wYXltZW50L3N0cmlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUs1QixNQUFhLE1BQU07SUFBbkI7UUFDSSxXQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN2QixtQkFBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUEyQjNDLENBQUM7O0FBN0JELHdCQTZCQztBQXpCbUIsYUFBTSxHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGdCQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUVoRywwQkFBbUIsR0FBRyxDQUFDLFFBQWdCLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQzFILGNBQWMsRUFBRSxNQUFNO0NBQ3pCLENBQUMsQ0FBQztBQUVIOztHQUVHO0FBQ2EscUJBQWMsR0FBRyxLQUFLLEVBQUUsUUFBNkIsRUFBRSxNQUFjLEVBQUUsT0FBdUYsRUFBRSxFQUFFO0lBQzlLLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLFFBQVEsQ0FBQztJQUNoRCxJQUFJLE1BQU0sR0FBRztRQUNULEtBQUs7UUFDTCxJQUFJLEVBQUUsR0FBRyxTQUFTLElBQUksUUFBUSxFQUFFO0tBQ25DLENBQUM7SUFDRixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxDQUFDLENBQUE7QUFFZSxhQUFNLEdBQUcsQ0FBQyxNQUFxQixFQUFFLE1BQWMsRUFBRSxFQUFFO0lBQy9ELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLDBCQUEwQjtJQUMxQixNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDO0lBQzNDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsQ0FBQyxDQUFBIn0=