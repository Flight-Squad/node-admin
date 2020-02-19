import admin, { firestore } from 'firebase-admin';
import fs from 'fs';
import { ConfigFunc } from '../../entity';
import { DbImplementation } from '../../database/interfaces';
import uuidv4 from 'uuid/v4';
// import { createFlightSquadDebugger } from '../../debugger';

// const debug = createFlightSquadDebugger('database');

export class Firebase implements DbImplementation {
    readonly firebase: admin.database.Database;
    readonly firestore: firestore.Firestore;

    private constructor(firebase, firestore) {
        this.firebase = firebase;
        this.firestore = firestore;
    }

    static readonly init: ConfigFunc<Firebase, FirebaseConfig> = config => {
        const { serviceAccount, firebaseUrl, serviceAccountPath } = config;
        // For some reason, initializeApp really wants to take in a require statement
        fs.writeFileSync(serviceAccountPath, serviceAccount);
        admin.initializeApp({
            //eslint-disable-next-line
            credential: admin.credential.cert(require(serviceAccountPath)),
            databaseURL: firebaseUrl,
        });
        return new Firebase(admin.database(), admin.firestore());
    };

    static readonly from = (firebase: admin.database.Database, firestore: firestore.Firestore): Firebase =>
        new Firebase(firebase, firestore);

    private mergeSet = (docRef: firestore.DocumentReference, data): Promise<firestore.WriteResult> =>
        docRef.set(data, { merge: true });

    private docRef = ({ path, coll, id }: FirestoreDocId): firestore.DocumentReference =>
        path ? this.firestore.doc(path) : this.firestore.collection(coll).doc(id);

    async del(doc: FirestoreDocId): Promise<firestore.WriteResult> {
        return this.docRef(doc).delete();
    }

    async getData(doc: FirestoreDocId): Promise<firestore.DocumentData> {
        return (await this.docRef(doc).get()).data;
    }

    readonly create = this.update;

    async update(coll: string, id: string, data): Promise<{ coll: string; id: string; data }> {
        const ref = this.docRef({ coll, id });
        await this.mergeSet(ref, data);
        return { coll, id, data };
    }

    async find<T extends FirestoreObject>(coll: string, id: string, clAss: new (props) => T): Promise<T> {
        const ref = this.docRef({ coll, id });
        const snapshot = await ref.get();
        // Have to return null as alternative because typescript won't let me return a boolean
        return snapshot.exists ? new clAss({ coll, id, ...snapshot.data(), db: this }) : null;
    }

    async delete(coll: string, id: string, preCondition?): Promise<firestore.WriteResult> {
        return this.docRef({ coll, id }).delete(preCondition);
    }

    static readonly Collections = {
        Searches: 'searches',
        Trips: 'trips',
        TripGroups: 'trip_groups',
        Transactions: 'transactions',
        Customers: 'customers',
    };
}

export interface FirestoreDocId {
    /** Optional if `path` is defined */
    coll?: string;

    /** doc id, Optional if creating a new document */
    id?: string;

    /** Optional if collection and docId are defined
     *
     * Note that docId is always optional if creating a new document
     */
    path?: string;
}

export interface FirebaseConfig {
    serviceAccount: string;
    firebaseUrl?: string;
    serviceAccountPath: string;
}

// Use for testing if you ever change anything

// const firebase = Firebase.init({
//     firebaseUrl: process.env.FIREBASE_URL,
//     serviceAccount: process.env.FS_CONFIG,
//     serviceAccountPath: path.resolve(__dirname, './serviceAccount.json'),
// });

// // Should output 'true true'
// console.log(Boolean(firebase.firestore), Boolean(firebase.firebase));

export abstract class FirestoreObject {
    id: string;
    db: Firebase;
    createdAt: string | number | Date | firestore.Timestamp;

    constructor(props: FirestoreObjectConfig) {
        const { id, db, ...data } = props;
        this.id = id || this.generateId();
        this.db = db;
        // Support for explicit collection setting
        this.collection = (): string => props.coll || props.collection || this.collection();
        for (const [key, val] of Object.entries(data)) {
            this[key] = val;
        }
    }

    /** Refers to the firestore collection of the object */
    abstract collection(): string;

    /** Find a database record by id */
    abstract find(id: string);

    generateId = (): string => uuidv4();

    /** Returns object with extraneous fields ommitted */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    data() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { db, ...data } = this;
        return JSON.parse(JSON.stringify(data));
    }

    /**
     * Returns instance of class passed in
     *
     * New instance is populated with latest data in store
     * @param clAss
     */
    refresh<T extends FirestoreObject>(clAss: new (props) => T): Promise<T> {
        return this.db.find(this.collection(), this.id, clAss);
    }

    // FUCD methods -- see Firebase object for

    /**
     *
     * @param data data to update server with
     * @param clAss Class to return an instance of
     */
    async updateDoc<T extends FirestoreObject>(data, clAss: new (props) => T): Promise<T> {
        await this.db.update(this.collection(), this.id, data);
        return new clAss({ id: this.id, db: this.db, ...this.data(), ...data });
    }

    async createDoc(): Promise<this> {
        this.createdAt = this.createdAt || firestore.Timestamp.fromDate(new Date());
        await this.db.update(this.collection(), this.id, this.data());
        return this;
    }

    async deleteDoc(): Promise<boolean> {
        await this.db.delete(this.collection(), this.id);
        return true;
    }
}

export interface FirestoreObjectConfig {
    id: string;
    db: Firebase;
    createdAt?: string | number | Date | firestore.Timestamp;
    // Suppport additional fields
    // eslint-disable-next-line
    [field: string]: any;
}

/**
 * Represents a Firebase Document
 */
export class FirebaseDoc {
    protected data;
    protected ref;
    constructor(path: string, db: Firebase) {
        this.ref = db.firebase.ref(path);
    }

    loaded = (): boolean => Boolean(this.data);

    async load(reference?): Promise<void> {
        const ref = reference || this.ref;
        this.data = (await ref.once('value')).val();
    }
}
