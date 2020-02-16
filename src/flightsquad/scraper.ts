import { TripGroupQuery } from '@flight-squad/common';
import { BatchQueue } from '../agents/amazon/batch';

export interface TripScraperQuery extends TripGroupQuery {
    provider: string;
    /** id of the trip group this trip query belongs to */
    group: string;
}

export class ScraperQueue extends BatchQueue<TripScraperQuery> {}
