"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
class Customer extends firebase_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.collection = () => Customer.Collection;
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
            });
        }
        // Customer is first doc that matches platform id
        return db.find(Customer.Collection, customerQuery.docs[0].id, Customer);
    }
}
exports.Customer = Customer;
Customer.Collection = firebase_1.Firebase.Collections.Customers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvY3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBc0Y7QUFvQnRGLE1BQWEsUUFBUyxTQUFRLDBCQUFlO0lBVXpDLFlBQVksS0FBcUI7UUFDN0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBSGpCLGVBQVUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBSS9DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFZO1FBQ2pDLGlCQUFpQjtRQUNqQixPQUFPLElBQUksUUFBUSxDQUFDO1lBQ2hCLEVBQUUsRUFBRSxFQUFFO1lBQ04sU0FBUyxFQUFFLEVBQUU7WUFDYixRQUFRLEVBQUUsRUFBRTtZQUNaLEdBQUcsRUFBRSxFQUFFO1lBQ1AsTUFBTSxFQUFFLEVBQUU7WUFDVixFQUFFO1NBQ0wsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQVksRUFBRSxRQUFnQixFQUFFLEVBQVU7UUFDakUsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsU0FBUzthQUNuQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQzthQUMvQixLQUFLLENBQUMsYUFBYSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQ3hDLEdBQUcsRUFBRSxDQUFDO1FBQ1gsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxRQUFRLENBQUM7Z0JBQ2hCLEVBQUUsRUFBRSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxFQUFFO2dCQUNiLFFBQVEsRUFBRSxFQUFFO2dCQUNaLEdBQUcsRUFBRSxFQUFFO2dCQUNQLE1BQU0sRUFBRSxFQUFFO2dCQUNWLEVBQUU7Z0JBQ0YsU0FBUyxFQUFFO29CQUNQLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtpQkFDakI7YUFDSixDQUFDLENBQUM7U0FDTjtRQUNELGlEQUFpRDtRQUNqRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1RSxDQUFDOztBQTlETCw0QkErREM7QUF4RG1CLG1CQUFVLEdBQUcsbUJBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDIn0=