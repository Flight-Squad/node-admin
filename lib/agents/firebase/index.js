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
const database_1 = require("../../database");
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
        return new clAss(Object.assign(Object.assign({ id: this.id, db: this.db }, this.data()), data));
    }
    async createDoc() {
        this.createdAt = firebase_admin_1.firestore.Timestamp.fromDate(new Date());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2ZpcmViYXNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUVBQWtEO0FBQ2xELDRDQUFvQjtBQUdwQiw2Q0FBMEM7QUFDMUMsaURBQTZCO0FBQzdCLDhEQUE4RDtBQUU5RCx1REFBdUQ7QUFFdkQsTUFBYSxRQUFRO0lBSWpCLFlBQW9CLFFBQVEsRUFBRSxTQUFTO1FBaUIvQixhQUFRLEdBQUcsQ0FBQyxNQUFtQyxFQUFFLElBQUksRUFBa0MsRUFBRSxDQUM3RixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLFdBQU0sR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQWtCLEVBQStCLEVBQUUsQ0FDakYsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBVXJFLFdBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBOUIxQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBb0JELEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBbUI7UUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQW1CO1FBQzdCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMs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