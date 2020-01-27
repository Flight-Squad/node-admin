import { TripGroupQuery } from '@flight-squad/common';

export interface TripScraperQuery extends TripGroupQuery {
    provider: string;
    /** id of the trip group this trip query belongs to */
    group: string;
}
