"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
class Customer extends firebase_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.collection = () => firebase_1.Firebase.Collections.Customers;
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
}
exports.Customer = Customer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvY3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBc0Y7QUFvQnRGLE1BQWEsUUFBUyxTQUFRLDBCQUFlO0lBU3pDLFlBQVksS0FBcUI7UUFDN0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBSGpCLGVBQVUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7SUFJMUQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQVk7UUFDakMsaUJBQWlCO1FBQ2pCLE9BQU8sSUFBSSxRQUFRLENBQUM7WUFDaEIsRUFBRSxFQUFFLEVBQUU7WUFDTixTQUFTLEVBQUUsRUFBRTtZQUNiLFFBQVEsRUFBRSxFQUFFO1lBQ1osR0FBRyxFQUFFLEVBQUU7WUFDUCxNQUFNLEVBQUUsRUFBRTtZQUNWLEVBQUU7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUE5QkQsNEJBOEJDIn0=