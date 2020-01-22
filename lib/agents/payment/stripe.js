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
Stripe.client = (apiKey, config) => new stripe_1.default(apiKey, config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FnZW50cy9wYXltZW50L3N0cmlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUs1QixNQUFhLE1BQU07SUFBbkI7UUFDSSxXQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN2QixtQkFBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUE0QjNDLENBQUM7O0FBOUJELHdCQThCQztBQTFCbUIsYUFBTSxHQUFHLENBQUMsTUFBYyxFQUFFLE1BQTJCLEVBQUUsRUFBRSxDQUFDLElBQUksZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFckYsMEJBQW1CLEdBQUcsQ0FBQyxRQUFnQixFQUFFLE1BQWMsRUFBRSxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtJQUMxSCxjQUFjLEVBQUUsTUFBTTtDQUN6QixDQUFDLENBQUM7QUFFSDs7R0FFRztBQUNhLHFCQUFjLEdBQUcsS0FBSyxFQUFFLFFBQTZCLEVBQUUsTUFBYyxFQUFFLE9BQXVGLEVBQUUsRUFBRTtJQUM5SyxNQUFNLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUMsR0FBRyxRQUFRLENBQUM7SUFDOUMsSUFBSSxNQUFNLEdBQUc7UUFDVCxLQUFLO1FBQ0wsSUFBSSxFQUFFLEdBQUcsU0FBUyxJQUFJLFFBQVEsRUFBRTtLQUNuQyxDQUFDO0lBQ0YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsQ0FBQyxDQUFBO0FBRWUsYUFBTSxHQUFHLENBQUMsTUFBcUIsRUFBRSxNQUFjLEVBQUUsRUFBRTtJQUMvRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QywwQkFBMEI7SUFDMUIsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQztJQUMzQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLENBQUMsQ0FBQSJ9