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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("../../database");
const v4_1 = __importDefault(require("uuid/v4"));
class Firebase {
    constructor(firebase, firestore) {
        this.mergeSet = (docRef, data) => docRef.set(data, { merge: true });
        this.docRef = ({ path, coll, id }) => path ? this.firestore.doc(path) : this.firestore.collection(coll).doc(id);
        this.create = this.update;
        this.firebase = firebase;
        this.firestore = firestore;
    }
    async del(doc) {
        return this.docRef(doc).delete();
    }
    async getData(doc) {
        return (await this.docRef(doc).get()).data;
    }
    async update(coll, id, data) {
        const ref = this.docRef({ coll, id });
        await this.mergeSet(ref, data);
        return { coll, id, data };
    }
    async find(coll, id, clAss) {
        const ref = this.docRef({ coll, id });
        const snapshot = await ref.get();
        // Have to return null as alternative because typescript won't let me return a boolean
        return snapshot.exists ? new clAss(Object.assign({ coll, id }, snapshot.data)) : null;
    }
    async delete(coll, id, preCondition) {
        return this.docRef({ coll, id }).delete(preCondition);
    }
}
exports.Firebase = Firebase;
Firebase.init = config => {
    const { serviceAccount, firebaseUrl, serviceAccountPath } = config;
    // For some reason, initializeApp really wants to take in a require statement
    fs_1.default.writeFileSync(serviceAccountPath, serviceAccount);
    firebase_admin_1.default.initializeApp({
        //eslint-disable-next-line
        credential: firebase_admin_1.default.credential.cert(require(serviceAccountPath)),
        databaseURL: firebaseUrl,
    });
    return new Firebase(firebase_admin_1.default.database(), firebase_admin_1.default.firestore());
};
Firebase.Collections = {
    Searches: 'searches',
    Trips: 'trips',
    TripGroups: 'trip_groups',
    Transactions: 'transactions',
    Customers: 'customers',
};
// Use for testing if you ever change anything
// const firebase = Firebase.init({
//     firebaseUrl: process.env.FIREBASE_URL,
//     serviceAccount: process.env.FS_CONFIG,
//     serviceAccountPath: path.resolve(__dirname, './serviceAccount.json'),
// });
// // Should output 'true true'
// console.log(Boolean(firebase.firestore), Boolean(firebase.firebase));
class FirestoreObject {
    constructor(props) {
        const { id, db } = props, data = __rest(props, ["id", "db"]);
        this.id = id || v4_1.default();
        // Easier testing
        if ((props.coll || props.collection) && process.env.NODE_ENV !== 'production') {
            this.collection = () => props.coll || props.collection || this.collection();
        }
        this.db = db || database_1.Database.firebase;
        for (const [key, val] of Object.entries(data)) {
            this[key] = val;
        }
    }
    /** Returns object with extraneous fields ommitted */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    data() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = this, { db } = _a, data = __rest(_a, ["db"]);
        return JSON.parse(JSON.stringify(data));
    }
    /**
     * Returns instance of class passed in
     *
     * New instance is populated with latest data in store
     * @param clAss
     */
    refresh(clAss) {
        return this.db.find(this.collection(), this.id, clAss);
    }
    // FUCD methods -- see Firebase object for
    /**
     *
     * @param data data to update server with
     * @param clAss Class to return an instance of
     */
    async updateDoc(data, clAss) {
        await this.db.update(this.collection(), this.id, data);
        return new clAss(Object.assign({ id: this.id, db: this.db }, this.data()));
    }
    async createDoc() {
        await this.db.update(this.collection(), this.id, this.data());
        return this;
    }
    async deleteDoc() {
        await this.db.delete(this.collection(), this.id);
        return true;
    }
}
exports.FirestoreObject = FirestoreObject;
/**
 * Represents a Firebase Document
 */
class FirebaseDoc {
    constructor(path, db) {
        this.loaded = () => Boolean(this.data);
        this.ref = db.firebase.ref(path);
    }
    async load(reference) {
        const ref = reference || this.ref;
        this.data = (await ref.once('value')).val();
    }
}
exports.FirebaseDoc = FirebaseDoc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2ZpcmViYXNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvRUFBa0Q7QUFDbEQsNENBQW9CO0FBR3BCLDZDQUEwQztBQUMxQyxpREFBNkI7QUFFN0IsTUFBYSxRQUFRO0lBSWpCLFlBQW9CLFFBQVEsRUFBRSxTQUFTO1FBaUIvQixhQUFRLEdBQUcsQ0FBQyxNQUFtQyxFQUFFLElBQUksRUFBa0MsRUFBRSxDQUM3RixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLFdBQU0sR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQWtCLEVBQStCLEVBQUUsQ0FDakYsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBVXJFLFdBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBOUIxQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBb0JELEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBbUI7UUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQW1CO1FBQzdCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FB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