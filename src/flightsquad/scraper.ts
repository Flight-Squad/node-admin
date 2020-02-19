import { TripGroupQuery } from '@flight-squad/common';
import { Queue } from '../queue';
import { Firebase } from '../agents';

export interface TripScraperQuery extends TripGroupQuery {
    provider: string;
    /** id of the trip group this trip query belongs to */
    group: string;
}

export enum ScraperDataTargets {
    Customer = 'customer',
    DatabaseOnly = 'database_only',
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

export class ScraperQueueHandler implements Queue<TripScraperQuery> {
    async push(data: TripScraperQuery): Promise<void> {
        await this.Db.firestore
            .collection(ScraperQueueHandler.Collection)
            .doc()
            .create({
                ...data,
                config: this.config,
            });
    }

    async pushAll(data: TripScraperQuery[]): Promise<void> {
        for (const item of data) {
            await this.push(item);
        }
    }

    static readonly Collection = 'scraper_queries';

    constructor(readonly Db: Firebase, readonly config: QueryConfig) {}
}
