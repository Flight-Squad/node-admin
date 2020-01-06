import { Firebase, FirebaseConfig } from '../agents/firebase';

export class Database {
    static firebase: Firebase;
    static readonly init = (cfg: FirebaseConfig): void => {
        Database.firebase = Firebase.init(cfg);
    };
}
