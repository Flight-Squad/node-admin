"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agents_1 = require("../agents");
const database_1 = require("../database");
const nanoid_1 = __importDefault(require("nanoid"));
/**
 * Make a transaction and use it to send follow up message to customer
 */
class Transaction extends agents_1.FirestoreObject {
    constructor(props) {
        super(props);
        // 139 yrs at avg 1k/ids/sec until statistcally significant chance of collision
        // https://zelark.github.io/nano-id-cc/
        this.generateId = () => nanoid_1.default(11);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxpZ2h0c3F1YWQvdHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzQ0FBNkU7QUFDN0UsMENBQXVDO0FBR3ZDLG9EQUE0QjtBQVU1Qjs7R0FFRztBQUNILE1BQWEsV0FBWSxTQUFRLHdCQUFlO0lBUTVDLFlBQVksS0FBd0I7UUFDaEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBSWpCLCtFQUErRTtRQUMvRSx1Q0FBdUM7UUFDdkMsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLGdCQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEMsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFJbEQsU0FBSSxHQUFHLENBQUMsRUFBVSxFQUF3QixFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBWHZFLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQ2hELENBQUM7SUFPRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQVksRUFBRSxFQUFVO1FBQ2hDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM1RCxDQUFDOztBQXBCTCxrQ0FzQkM7QUFqQm1CLHNCQUFVLEdBQUcsaUJBQVEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO0FBRXZDLHFCQUFTLEdBQUcsbUJBQVEsQ0FBQyxRQUFRLENBQUMifQ==