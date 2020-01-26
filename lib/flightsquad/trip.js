"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
const search_1 = require("./search");
const database_1 = require("../database");
const debugger_1 = require("../debugger");
const common_1 = require("@flight-squad/common");
const debug = debugger_1.createFlightSquadDebugger('trip');
/** Processing Status */
var TripGroupProcStatus;
(function (TripGroupProcStatus) {
    /** Waiting in Queue */
    TripGroupProcStatus[TripGroupProcStatus["Waiting"] = 0] = "Waiting";
    /** Currently being processed */
    TripGroupProcStatus[TripGroupProcStatus["InProgress"] = 1] = "InProgress";
    /** Processing Canceled */
    TripGroupProcStatus[TripGroupProcStatus["Cancelled"] = 2] = "Cancelled";
    /** All conditions and subcomponents of the TripGroup have been satisfied:
     *
     * - Each search provider was scraped
     */
    TripGroupProcStatus[TripGroupProcStatus["Done"] = 3] = "Done";
})(TripGroupProcStatus = exports.TripGroupProcStatus || (exports.TripGroupProcStatus = {}));
class TripGroup extends firebase_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.collection = () => TripGroup.Collection;
        this.updateStatus = (status) => this.updateDoc({ status }, TripGroup);
        this.bestTrip = () => this.sortByPriceAsc()[0];
        this.db = props.db || TripGroup.defaultDb;
    }
    static find(db, id) {
        return db.find(TripGroup.Collection, id, TripGroup);
    }
    find(id) {
        return TripGroup.find(this.db, id);
    }
    /**
     * Step 1: Start scraping trips
     * @param queue
     */
    async startScraping(queue) {
        debug('Starting Scraping: Trip Groups %s', this.id);
        const tripsToScrape = [];
        for (const [, provider] of Object.entries(common_1.SearchProviders)) {
            tripsToScrape.push(Object.assign(Object.assign({}, this.query), { provider, group: this.id }));
        }
        await queue.pushAll(tripsToScrape);
        return this.updateStatus(TripGroupProcStatus.InProgress);
    }
    /**
     * Step 2: Add provider results
     * @param provider
     * @param results
     */
    addProvider(provider, results) {
        debug('Adding provider %s to group %s', provider, this.id);
        const providers = this.providers;
        providers[provider] = results;
        return this.updateDoc({ providers }, TripGroup);
    }
    /**
     * Step 3: Check for completion
     */
    isDone() {
        const TripGroupProviders = Object.keys(this.providers);
        const searchProviders = Object.values(common_1.SearchProviders);
        // Each Search Provider has been scraped
        return searchProviders.every(prov => TripGroupProviders.includes(prov));
    }
    /**
     * Step 4: Mark Trip Group as finished
     *
     * Returns the `FlightSearch` that this trip group is a part of
     *
     * Returns `null` if the trip group isn't done yet.
     */
    async finish() {
        debug('Trying to finish group %s', this.id);
        if (this.isDone()) {
            // Update Status
            await this.updateStatus(TripGroupProcStatus.Done);
            // Mark as finished in parent search
            const search = await this.db.find(search_1.FlightSearch.Collection, this.searchId, search_1.FlightSearch);
            return search.completeTripGroup(this.id);
        }
        return null;
    }
    // CONSIDER inverse dependency flow for testing?
    sortByPriceAsc() {
        const options = [];
        // Aggregate all entries
        for (const key of Object.keys(this.providers)) {
            options.push(this.bestTripFrom(key));
        }
        return options.sort(TripGroup.SortPriceAsc);
    }
    bestTripFrom(provider) {
        debug('Getting best trip from %s in group %s', provider, this.id);
        return this.providers[provider].data.sort(TripGroup.SortPriceAsc)[0];
    }
    benchmarkTrip() {
        // TODO implement failure case
        // returns lowest google price
        return this.bestTripFrom(common_1.SearchProviders.GoogleFlights);
    }
}
exports.TripGroup = TripGroup;
TripGroup.defaultDb = database_1.Database.firebase;
TripGroup.Collection = firebase_1.Firebase.Collections.TripGroups;
TripGroup.SortPriceAsc = (a, b) => a.price - b.price;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC90cmlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQXNGO0FBQ3RGLHFDQUFxRDtBQUNyRCwwQ0FBdUM7QUFHdkMsMENBQXdEO0FBQ3hELGlEQUE2RDtBQUU3RCxNQUFNLEtBQUssR0FBRyxvQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQW1CaEQsd0JBQXdCO0FBQ3hCLElBQVksbUJBWVg7QUFaRCxXQUFZLG1CQUFtQjtJQUMzQix1QkFBdUI7SUFDdkIsbUVBQU8sQ0FBQTtJQUNQLGdDQUFnQztJQUNoQyx5RUFBVSxDQUFBO0lBQ1YsMEJBQTBCO0lBQzFCLHVFQUFTLENBQUE7SUFDVDs7O09BR0c7SUFDSCw2REFBSSxDQUFBO0FBQ1IsQ0FBQyxFQVpXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBWTlCO0FBY0QsTUFBYSxTQUFVLFNBQVEsMEJBQWU7SUFxQjFDLFlBQVksS0FBc0I7UUFDOUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBWGpCLGVBQVUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1FBMkVoRCxpQkFBWSxHQUFHLENBQUMsTUFBMkIsRUFBc0IsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQVkxRyxhQUFRLEdBQUcsR0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBM0U1QyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUM5QyxDQUFDO0lBWEQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFZLEVBQUUsRUFBVTtRQUNoQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksQ0FBQyxFQUFVO1FBQ1gsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQU9EOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBOEI7UUFDOUMsS0FBSyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRCxNQUFNLGFBQWEsR0FBdUIsRUFBRSxDQUFDO1FBQzdDLEtBQUssTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBZSxDQUFDLEVBQUU7WUFDeEQsYUFBYSxDQUFDLElBQUksaUNBQ1gsSUFBSSxDQUFDLEtBQUssS0FDYixRQUFRLEVBQ1IsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQ2hCLENBQUM7U0FDTjtRQUNELE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsUUFBeUIsRUFBRSxPQUF3QjtRQUMzRCxLQUFLLENBQUMsZ0NBQWdDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTTtRQUNGLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBZSxDQUFDLENBQUM7UUFFdkQsd0NBQXdDO1FBQ3hDLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsTUFBTTtRQUNSLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDZixnQkFBZ0I7WUFDaEIsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELG9DQUFvQztZQUNwQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUscUJBQVksQ0FBQyxDQUFDO1lBQ3hGLE9BQU8sTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFJRCxnREFBZ0Q7SUFDaEQsY0FBYztRQUNWLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNuQix3QkFBd0I7UUFDeEIsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUlELFlBQVksQ0FBQyxRQUFrQztRQUMzQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELGFBQWE7UUFDVCw4QkFBOEI7UUFDOUIsOEJBQThCO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVELENBQUM7O0FBN0dMLDhCQThHQztBQXhHMkIsbUJBQVMsR0FBRyxtQkFBUSxDQUFDLFFBQVEsQ0FBQztBQUV0QyxvQkFBVSxHQUFHLG1CQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztBQUM3QyxzQkFBWSxHQUFHLENBQUMsQ0FBTyxFQUFFLENBQU8sRUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDIn0=