"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_1 = require("../agents");
const database_1 = require("../database");
/**
 * Make a transaction and use it to send follow up message to customer
 */
class Transaction extends agents_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.collection = () => Transaction.Collection;
        this.find = (id) => Transaction.find(this.db, id);
        this.db = props.db || Transaction.defaultDb;
    }
    static find(db, id) {
        return db.find(Transaction.Collection, id, Transaction);
    }
}
exports.Transaction = Transaction;
Transaction.Collection = agents_1.Firebase.Collections.Transactions;
Transaction.defaultDb = database_1.Database.firebase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkU7QUFDN0UsMENBQXVDO0FBWXZDOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsd0JBQWU7SUFRNUMsWUFBWSxLQUF3QjtRQUNoQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFJakIsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFJbEQsU0FBSSxHQUFHLENBQUMsRUFBVSxFQUF3QixFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBUHZFLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQ2hELENBQUM7SUFHRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQVksRUFBRSxFQUFVO1FBQ2hDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM1RCxDQUFDOztBQWhCTCxrQ0FrQkM7QUFibUIsc0JBQVUsR0FBRyxpQkFBUSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7QUFFdkMscUJBQVMsR0FBRyxtQkFBUSxDQUFDLFFBQVEsQ0FBQyJ9