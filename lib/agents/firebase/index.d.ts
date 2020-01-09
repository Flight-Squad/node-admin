import admin, { firestore } from 'firebase-admin';
import { ConfigFunc } from '../../entity';
import { DbImplementation } from '../../database/interfaces';
export declare class Firebase implements DbImplementation {
    readonly firebase: admin.database.Database;
    readonly firestore: firestore.Firestore;
    private constructor();
    static readonly init: ConfigFunc<Firebase, FirebaseConfig>;
    private mergeSet;
    private docRef;
    del(doc: FirestoreDocId): Promise<firestore.WriteResult>;
    getData(doc: FirestoreDocId): Promise<firestore.DocumentData>;
    readonly create: (coll: string, id: string, data: any) => Promise<{
        coll: string;
        id: string;
        data: any;
    }>;
    update(coll: string, id: string, data: any): Promise<{
        coll: string;
        id: string;
        data: any;
    }>;
    find<T extends FirestoreObject>(coll: string, id: string, clAss: new (props: any) => T): Promise<T>;
    delete(coll: string, id: string, preCondition?: any): Promise<firestore.WriteResult>;
    static readonly Collections: {
        Searches: string;
        Trips: string;
        TripGroups: string;
        Transactions: string;
        Customers: string;
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
export declare abstract class FirestoreObject {
    id: string;
    coll: string;
    db: Firebase;
    constructor(props: FirestoreObjectConfig);
    /** Refers to the firestore collection of the object */
    abstract collection(): string;
    /** Returns object with extraneous fields ommitted */
    data(): Pick<this, Exclude<keyof this, "id" | "data" | "coll" | "db" | "collection" | "refresh" | "updateDoc" | "createDoc" | "deleteDoc">>;
    /**
     * Returns instance of class passed in
     *
     * New instance is populated with latest data in store
     * @param clAss
     */
    refresh<T extends FirestoreObject>(clAss: new (props: any) => T): Promise<T>;
    /**
     *
     * @param data data to update server with
     * @param clAss Class to return an instance of
     */
    updateDoc<T extends FirestoreObject>(data: any, clAss: new (props: any) => T): Promise<T>;
    createDoc(): Promise<this>;
    deleteDoc(): Promise<boolean>;
}
export interface FirestoreObjectConfig {
    id: string;
    db: Firebase;
    [field: string]: any;
}
