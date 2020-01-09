"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
class Customer extends firebase_1.FirestoreObject {
    constructor() {
        super(...arguments);
        this.collection = () => firebase_1.Firebase.Collections.Customers;
    }
    static createNewCustomer() {
        // TODO implement
        return null;
    }
}
exports.Customer = Customer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvY3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBc0Y7QUFvQnRGLE1BQWEsUUFBUyxTQUFRLDBCQUFlO0lBQTdDOztRQU9JLGVBQVUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7SUFNOUQsQ0FBQztJQUpHLE1BQU0sQ0FBQyxpQkFBaUI7UUFDcEIsaUJBQWlCO1FBQ2pCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQWJELDRCQWFDIn0=