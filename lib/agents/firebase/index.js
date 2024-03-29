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
Firebase.from = (firebase, firestore) => new Firebase(firebase, firestore);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2ZpcmViYXNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWtEO0FBQ2xELDRDQUFvQjtBQUdwQixpREFBNkI7QUFDN0IsOERBQThEO0FBRTlELHVEQUF1RDtBQUV2RCxNQUFhLFFBQVE7SUFJakIsWUFBb0IsUUFBUSxFQUFFLFNBQVM7UUFvQi9CLGFBQVEsR0FBRyxDQUFDLE1BQW1DLEVBQUUsSUFBSSxFQUFrQyxFQUFFLENBQzdGLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFOUIsV0FBTSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBa0IsRUFBK0IsRUFBRSxDQUNqRixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFVckUsV0FBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFqQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUF1QkQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFtQjtRQUN6QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBbUI7UUFDN0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FB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