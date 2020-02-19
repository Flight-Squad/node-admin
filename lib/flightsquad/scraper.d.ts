import { TripGroupQuery } from '@flight-squad/common';
import { Queue } from '../queue';
import { Firebase } from '../agents';
export interface TripScraperQuery extends TripGroupQuery {
    provider: string;
    /** id of the trip group this trip query belongs to */
    group: string;
}
export declare enum ScraperDataTargets {
    Customer = "customer",
    DatabaseOnly = "database_only"
}
export interface QueryConfig {
    chatsquad: string;
    pricesquad: string;
    businessStrategy: {
        doc: string;
        sheetNames: {
            discount: string;
        };
    };
    dataTarget: string | ScraperDataTargets;
}
export interface ConfiguredScraperQuery extends TripScraperQuery {
    config: QueryConfig;
}
export declare class ScraperQueueHandler implements Queue<TripScraperQuery> {
    readonly Db: Firebase;
    readonly config: QueryConfig;
    push(data: TripScraperQuery): Promise<void>;
    pushAll(data: TripScraperQuery[]): Promise<void>;
    static readonly Collection = "scraper_queries";
    constructor(Db: Firebase, config: QueryConfig);
}
