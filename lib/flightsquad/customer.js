"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
const search_1 = require("./search");
class Customer extends firebase_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.collection = () => Customer.Collection;
    }
    /**
     * Starts a search for the query
     * @param query
     * @param queue To handle long-running jobs
     * @param meta Where and how the query was made
     */
    async requestSearch(query, queue, meta) {
        let search = await search_1.FlightSearch.make(query, Object.assign(Object.assign({}, meta), { customer: this.id }), this.db).createDoc();
        search = await search.start(queue);
        return this.addSearch(search);
    }
    /**
     * Adds record of search to customer info
     * @param search
     */
    addSearch(search) {
        this.searches[search.id] = {};
        return this.updateDoc({ searches: this.searches }, Customer);
    }
    /**
     * Returns object with only the customer's identifiers
     */
    identifiers() {
        const _a = this.data(), { searches, transactions } = _a, identifiers = __rest(_a, ["searches", "transactions"]);
        return identifiers;
    }
    /**
     * Returns object with only the customer's actions on the platform, such as:
     *
     * - Searches
     * - Transactions
     */
    activities() {
        const { searches, transactions } = this.data();
        return { searches, transactions };
    }
    /**
     * Returns a customer with unique id and empty fields
     *
     * Does ***not*** add customer database
     * @param db
     */
    static createNewCustomer(db) {
        return new Customer({
            id: '',
            firstName: '',
            lastName: '',
            dob: '',
            stripe: '',
            searches: {},
            transactions: {},
            db,
        });
    }
    /**
     * Finds a customer based on messaging platform and id.
     *
     * If no existing customer is found, an object representing a new customer is returned
     *
     * Does not write to `db`.
     * @param db
     * @param platform
     * @param id
     */
    static async fromMessaging(db, platform, id) {
        const customerQuery = await db.firestore
            .collection(Customer.Collection)
            .where(`messaging.${platform}`, '==', id)
            .get();
        if (customerQuery.empty) {
            return new Customer(Object.assign({
                messaging: {
                    [platform]: id,
                },
            }, Customer.createNewCustomer(db).data()));
        }
        // Customer is first doc that matches platform id
        return db.find(Customer.Collection, customerQuery.docs[0].id, Customer);
    }
}
exports.Customer = Customer;
Customer.Collection = firebase_1.Firebase.Collections.Customers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvY3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFzRjtBQUN0RixxQ0FBaUU7QUF1Q2pFLE1BQWEsUUFBUyxTQUFRLDBCQUFlO0lBMkd6QyxZQUFZLEtBQXFCO1FBQzdCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQWpHakIsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFrRy9DLENBQUM7SUFoR0Q7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUNmLEtBQThCLEVBQzlCLEtBQThCLEVBQzlCLElBQTJDO1FBRTNDLElBQUksTUFBTSxHQUFHLE1BQU0scUJBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxrQ0FBTyxJQUFJLEtBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLEtBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pHLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQUMsTUFBb0I7UUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVztRQUNQLE1BQU0sZ0JBQXdELEVBQXhELEVBQUUsUUFBUSxFQUFFLFlBQVksT0FBZ0MsRUFBOUIsc0RBQThCLENBQUM7UUFDL0QsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsVUFBVTtRQUNOLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQVk7UUFDakMsT0FBTyxJQUFJLFFBQVEsQ0FBQztZQUNoQixFQUFFLEVBQUUsRUFBRTtZQUNOLFNBQVMsRUFBRSxFQUFFO1lBQ2IsUUFBUSxFQUFFLEVBQUU7WUFDWixHQUFHLEVBQUUsRUFBRTtZQUNQLE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUU7WUFDWixZQUFZLEVBQUUsRUFBRTtZQUNoQixFQUFFO1NBQ0wsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQVksRUFBRSxRQUFnQixFQUFFLEVBQVU7UUFDakUsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsU0FBUzthQUNuQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzthQUMvQixLQUFLLENBQUMsYUFBYSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQ3hDLEdBQUcsRUFBRSxDQUFDO1FBQ1gsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxRQUFRLENBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FDVDtnQkFDSSxTQUFTLEVBQUU7b0JBQ1AsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO2lCQUNqQjthQUNKLEVBQ0QsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUN4QyxDQUNKLENBQUM7U0FDTDtRQUNELGlEQUFpRDtRQUNqRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1RSxDQUFDOztBQXpHTCw0QkE4R0M7QUFwR21CLG1CQUFVLEdBQUcsbUJBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDIn0=