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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importStar(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const v4_1 = __importDefault(require("uuid/v4"));
// import { createFlightSquadDebugger } from '../../debugger';
// const debug = createFlightSquadDebugger('database');
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
        this.generateId = () => v4_1.default();
        const { id, db } = props, data = __rest(props, ["id", "db"]);
        this.id = id || this.generateId();
        this.db = db;
        // Support for explicit collection setting
        this.collection = () => props.coll || props.collection || this.collection();
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
        return new clAss(Object.assign(Object.assign({ id: this.id, db: this.db }, this.data()), data));
    }
    async createDoc() {
        this.createdAt = this.createdAt || firebase_admin_1.firestore.Timestamp.fromDate(new Date());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2ZpcmViYXNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWtEO0FBQ2xELDRDQUFvQjtBQUdwQixpREFBNkI7QUFDN0IsOERBQThEO0FBRTlELHVEQUF1RDtBQUV2RCxNQUFhLFFBQVE7SUFJakIsWUFBb0IsUUFBUSxFQUFFLFNBQVM7UUFpQi9CLGFBQVEsR0FBRyxDQUFDLE1BQW1DLEVBQUUsSUFBSSxFQUFrQyxFQUFFLENBQzdGLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFOUIsV0FBTSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBa0IsRUFBK0IsRUFBRSxDQUNqRixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFVckUsV0FBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUE5QjFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFvQkQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFtQjtRQUN6QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBbUI7UUFDN0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FB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