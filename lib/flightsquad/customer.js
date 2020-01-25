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
        this.getUserId = (messagingPlatform) => this.messaging[messagingPlatform];
        this.find = (id) => Customer.find(this.db, id);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // static readonly find(db: )
    static find(db, id) {
        return db.find(Customer.Collection, id, Customer);
    }
}
exports.Customer = Customer;
Customer.Collection = firebase_1.Firebase.Collections.Customers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvY3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFzRjtBQUN0RixxQ0FBaUU7QUF1Q2pFLE1BQWEsUUFBUyxTQUFRLDBCQUFlO0lBc0h6QyxZQUFZLEtBQXFCO1FBQzdCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQTVHakIsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUErQ3RDLGNBQVMsR0FBRyxDQUFDLGlCQUF5QixFQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUEwRDlGLFNBQUksR0FBRyxDQUFDLEVBQVUsRUFBcUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUlyRSxDQUFDO0lBM0dEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FDZixLQUE4QixFQUM5QixLQUE4QixFQUM5QixJQUEyQztRQUUzQyxJQUFJLE1BQU0sR0FBRyxNQUFNLHFCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssa0NBQU8sSUFBSSxLQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxLQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqRyxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxDQUFDLE1BQW9CO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDUCw2REFBNkQ7UUFDN0QsTUFBTSxnQkFBd0QsRUFBeEQsRUFBRSxRQUFRLEVBQUUsWUFBWSxPQUFnQyxFQUE5QixzREFBOEIsQ0FBQztRQUMvRCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxVQUFVO1FBQ04sTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBSUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsaUJBQWlCLENBQUMsRUFBWTtRQUNqQyxPQUFPLElBQUksUUFBUSxDQUFDO1lBQ2hCLEVBQUUsRUFBRSxFQUFFO1lBQ04sU0FBUyxFQUFFLEVBQUU7WUFDYixRQUFRLEVBQUUsRUFBRTtZQUNaLEdBQUcsRUFBRSxFQUFFO1lBQ1AsTUFBTSxFQUFFLEVBQUU7WUFDVixRQUFRLEVBQUUsRUFBRTtZQUNaLFlBQVksRUFBRSxFQUFFO1lBQ2hCLEVBQUU7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBWSxFQUFFLFFBQWdCLEVBQUUsRUFBVTtRQUNqRSxNQUFNLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxTQUFTO2FBQ25DLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO2FBQy9CLEtBQUssQ0FBQyxhQUFhLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7YUFDeEMsR0FBRyxFQUFFLENBQUM7UUFDWCxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUU7WUFDckIsT0FBTyxJQUFJLFFBQVEsQ0FDZixNQUFNLENBQUMsTUFBTSxDQUNUO2dCQUNJLFNBQVMsRUFBRTtvQkFDUCxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7aUJBQ2pCO2FBQ0osRUFDRCxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQ3hDLENBQ0osQ0FBQztTQUNMO1FBQ0QsaURBQWlEO1FBQ2pELE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCw2QkFBNkI7SUFFN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFZLEVBQUUsRUFBVTtRQUNoQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEQsQ0FBQzs7QUFsSEwsNEJBeUhDO0FBL0dtQixtQkFBVSxHQUFHLG1CQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyJ9