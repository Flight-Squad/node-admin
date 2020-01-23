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
        this.db = props.db || Transaction.defaultDb;
    }
}
exports.Transaction = Transaction;
Transaction.Collection = agents_1.Firebase.Collections.Transactions;
Transaction.defaultDb = database_1.Database.firebase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkU7QUFDN0UsMENBQXVDO0FBYXZDOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsd0JBQWU7SUFRNUMsWUFBWSxLQUF3QjtRQUNoQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFJakIsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFIOUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUM7SUFDaEQsQ0FBQzs7QUFYTCxrQ0FjQztBQVRtQixzQkFBVSxHQUFHLGlCQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztBQUV2QyxxQkFBUyxHQUFHLG1CQUFRLENBQUMsUUFBUSxDQUFDIn0=