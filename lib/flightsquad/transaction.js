"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_1 = require("../agents");
const database_1 = require("../database");
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["Created"] = 0] = "Created";
    TransactionStatus[TransactionStatus["Pending"] = 1] = "Pending";
    TransactionStatus[TransactionStatus["Processed"] = 2] = "Processed";
    TransactionStatus[TransactionStatus["Failed"] = 3] = "Failed";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkU7QUFDN0UsMENBQXVDO0FBWXZDLElBQVksaUJBS1g7QUFMRCxXQUFZLGlCQUFpQjtJQUN6QiwrREFBTyxDQUFBO0lBQ1AsK0RBQU8sQ0FBQTtJQUNQLG1FQUFTLENBQUE7SUFDVCw2REFBTSxDQUFBO0FBQ1YsQ0FBQyxFQUxXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBSzVCO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFdBQVksU0FBUSx3QkFBZTtJQVE1QyxZQUFZLEtBQXdCO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUlqQixlQUFVLEdBQUcsR0FBVyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztRQUg5QyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQztJQUNoRCxDQUFDOztBQVhMLGtDQWNDO0FBVG1CLHNCQUFVLEdBQUcsaUJBQVEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO0FBRXZDLHFCQUFTLEdBQUcsbUJBQVEsQ0FBQyxRQUFRLENBQUMifQ==