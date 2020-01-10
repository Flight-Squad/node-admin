"use strict";
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
     * Returns a customer with unique id and empty fields
     *
     * Does ***not*** add customer database
     * @param db
     */
    static createNewCustomer(db) {
        // TODO implement
        return new Customer({
            id: '',
            firstName: '',
            lastName: '',
            dob: '',
            stripe: '',
            searches: {},
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
            return new Customer({
                id: '',
                firstName: '',
                lastName: '',
                dob: '',
                stripe: '',
                db,
                messaging: {
                    [platform]: id,
                },
                searches: {},
            });
        }
        // Customer is first doc that matches platform id
        return db.find(Customer.Collection, customerQuery.docs[0].id, Customer);
    }
}
exports.Customer = Customer;
Customer.Collection = firebase_1.Firebase.Collections.Customers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvY3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBc0Y7QUFDdEYscUNBQWlFO0FBMkJqRSxNQUFhLFFBQVMsU0FBUSwwQkFBZTtJQXdGekMsWUFBWSxLQUFxQjtRQUM3QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFoRmpCLGVBQVUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBaUYvQyxDQUFDO0lBL0VEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FDZixLQUE4QixFQUM5QixLQUE4QixFQUM5QixJQUEyQztRQUUzQyxJQUFJLE1BQU0sR0FBRyxNQUFNLHFCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssa0NBQU8sSUFBSSxLQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxLQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqRyxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxDQUFDLE1BQW9CO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFZO1FBQ2pDLGlCQUFpQjtRQUNqQixPQUFPLElBQUksUUFBUSxDQUFDO1lBQ2hCLEVBQUUsRUFBRSxFQUFFO1lBQ04sU0FBUyxFQUFFLEVBQUU7WUFDYixRQUFRLEVBQUUsRUFBRTtZQUNaLEdBQUcsRUFBRSxFQUFFO1lBQ1AsTUFBTSxFQUFFLEVBQUU7WUFDVixRQUFRLEVBQUUsRUFBRTtZQUNaLEVBQUU7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBWSxFQUFFLFFBQWdCLEVBQUUsRUFBVTtRQUNqRSxNQUFNLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxTQUFTO2FBQ25DLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO2FBQy9CLEtBQUssQ0FBQyxhQUFhLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7YUFDeEMsR0FBRyxFQUFFLENBQUM7UUFDWCxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUU7WUFDckIsT0FBTyxJQUFJLFFBQVEsQ0FBQztnQkFDaEIsRUFBRSxFQUFFLEVBQUU7Z0JBQ04sU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osR0FBRyxFQUFFLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsRUFBRTtnQkFDRixTQUFTLEVBQUU7b0JBQ1AsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO2lCQUNqQjtnQkFDRCxRQUFRLEVBQUUsRUFBRTthQUNmLENBQUMsQ0FBQztTQUNOO1FBQ0QsaURBQWlEO1FBQ2pELE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVFLENBQUM7O0FBdEZMLDRCQTJGQztBQW5GbUIsbUJBQVUsR0FBRyxtQkFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMifQ==