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
const debugger_1 = require("../../debugger");
const debug = debugger_1.createFlightSquadDebugger('database');
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
        return snapshot.exists ? new clAss(Object.assign(Object.assign({ coll, id }, snapshot.data()), { db: this })) : null;
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
        debug('on updateDoc, instantiating new class with props: %O', Object.assign(Object.assign({ id: this.id, db: this.db }, this.data()), data));
        return new clAss(Object.assign(Object.assign({ id: this.id, db: this.db }, this.data()), data));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2ZpcmViYXNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvRUFBa0Q7QUFDbEQsNENBQW9CO0FBR3BCLDZDQUEwQztBQUMxQyxpREFBNkI7QUFDN0IsNkNBQTJEO0FBRTNELE1BQU0sS0FBSyxHQUFHLG9DQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXBELE1BQWEsUUFBUTtJQUlqQixZQUFvQixRQUFRLEVBQUUsU0FBUztRQWlCL0IsYUFBUSxHQUFHLENBQUMsTUFBbUMsRUFBRSxJQUFJLEVBQWtDLEVBQUUsQ0FDN0YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUU5QixXQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFrQixFQUErQixFQUFFLENBQ2pGLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQVVyRSxXQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQTlCMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQW9CRCxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQW1CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFtQjtRQUM3QixPQUFPLENB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