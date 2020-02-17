import { FirestoreObjectConfig, FirestoreObject, Firebase } from '../agents/firebase';
import { FlightSearch } from './search';
import { Database } from '../database';
import { Queue } from '../queue';
import { TripScraperQuery } from './scraper';
import { createFlightSquadDebugger } from '../debugger';
import { Trip, SearchProviders, TripGroupQuery } from '@flight-squad/common';

const debug = createFlightSquadDebugger('trip');

export { TripGroupQuery };

export interface TripGroupFields extends FirestoreObjectConfig {
    query: TripGroupQuery;
    status: TripGroupProcStatus;
    providers: TripGroupProviders;
    /** The search this Trip Group belongs to */
    searchId: string;
}

/** Processing Status */
export enum TripGroupProcStatus {
    /** Waiting in Queue */
    Waiting,
    /** Currently being processed */
    InProgress,
    /** Processing Canceled */
    Cancelled,
    /** All conditions and subcomponents of the TripGroup have been satisfied:
     *
     * - Each search provider was scraped
     */
    Done,
}

export interface TripGroupProviders {
    [searchProvider: string]: ProviderResults;
}

/** Interface for results from scraper */
export interface ProviderResults {
    /** trips scraped from Url */
    data: Trip[];
    /** Url that was scraped */
    url: string;
}

export class TripGroup extends FirestoreObject implements TripGroupFields {
    readonly query: TripGroupQuery;
    readonly status: TripGroupProcStatus;
    readonly providers: TripGroupProviders;
    readonly searchId: string;

    private static readonly defaultDb = Database.firebase;

    static readonly Collection = Firebase.Collections.TripGroups;
    static readonly SortPriceAsc = (a: Trip, b: Trip): number => a.price - b.price;

    collection = (): string => TripGroup.Collection;

    static find(db: Firebase, id: string): Promise<TripGroup> {
        return db.find(TripGroup.Collection, id, TripGroup);
    }

    find(id: string): Promise<TripGroup> {
        return TripGroup.find(this.db, id);
    }

    constructor(props: TripGroupFields) {
        super(props);
        this.db = props.db || TripGroup.defaultDb;
    }

    /**
     * Step 1: Start scraping trips
     * @param queue
     */
    async startScraping(queue: Queue<TripScraperQuery>): Promise<TripGroup> {
        debug('Starting Scraping: Trip Groups %s', this.id);
        const tripsToScrape: TripScraperQuery[] = [];
        for (const [, provider] of Object.entries(SearchProviders)) {
            tripsToScrape.push({
                ...this.query,
                provider,
                group: this.id,
            });
        }
        await queue.pushAll(tripsToScrape);
        return this.updateStatus(TripGroupProcStatus.InProgress);
    }

    /**
     * Step 2: Add provider results
     * @param provider
     * @param results
     */
    addProvider(provider: SearchProviders, results: ProviderResults): Promise<TripGroup> {
        debug('Adding provider %s to group %s', provider, this.id);
        const providers = this.providers;
        providers[provider] = results;
        return this.updateDoc({ providers }, TripGroup);
    }

    /**
     * Step 3: Check for completion
     */
    isDone(): boolean {
        const TripGroupProviders = Object.keys(this.providers);
        debug('group::isDone:: Finished Group Providers:');
        debug(TripGroupProviders);

        const searchProviders = Object.values(SearchProviders);
        debug('group::isDone:: All Search Providers:');
        debug(TripGroupProviders);

        const isDone = searchProviders.every(prov => TripGroupProviders.includes(prov));
        debug(`group::isDone:: isDone: ${isDone}`);

        // Each Search Provider has been scraped
        return isDone;
    }

    /**
     * Step 4: Mark Trip Group as finished
     *
     * Returns the `FlightSearch` that this trip group is a part of
     *
     * Returns `null` if the trip group isn't done yet.
     */
    async finish(): Promise<FlightSearch> {
        debug('Trying to finish group %s', this.id);
        if (this.isDone()) {
            // Update Status
            await this.updateStatus(TripGroupProcStatus.Done);
            // Mark as finished in parent search
            const search = await this.db.find(FlightSearch.Collection, this.searchId, FlightSearch);
            return search.completeTripGroup(this.id);
        }
        return null;
    }

    updateStatus = (status: TripGroupProcStatus): Promise<TripGroup> => this.updateDoc({ status }, TripGroup);

    // CONSIDER inverse dependency flow for testing?
    sortByPriceAsc(): Array<Trip> {
        const options = [];
        // Aggregate all entries
        for (const key of Object.keys(this.providers)) {
            options.push(this.bestTripFrom(key));
        }
        return options.sort(TripGroup.SortPriceAsc);
    }

    bestTrip = (): Trip => this.sortByPriceAsc()[0];

    bestTripFrom(provider: SearchProviders | string): Trip {
        debug('Getting best trip from %s in group %s', provider, this.id);
        return this.providers[provider].data.sort(TripGroup.SortPriceAsc)[0];
    }

    benchmarkTrip(): Trip {
        // TODO implement failure case
        // returns lowest google price
        return this.bestTripFrom(SearchProviders.GoogleFlights);
    }
}
