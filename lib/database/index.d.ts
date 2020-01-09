import { Firebase, FirebaseConfig } from '../agents/firebase';
export declare class Database {
    static firebase: Firebase;
    static readonly init: (cfg: FirebaseConfig) => void;
}
