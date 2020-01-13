"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
const search_1 = require("./search");
const database_1 = require("../database");
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
/** Search Providers enabled
 *
 * Key is scraper module
 *
 * Value is key of scraper results in TripGroup object
 */
var SearchProviders;
(function (SearchProviders) {
    SearchProviders["GoogleFlights"] = "google";
})(SearchProviders = exports.SearchProviders || (exports.SearchProviders = {}));
class TripGroup extends firebase_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.collection = () => TripGroup.Collection;
        this.updateStatus = (status) => this.updateDoc({ status }, TripGroup);
        this.bestTrip = () => this.sortByPriceAsc()[0];
        this.db = props.db || TripGroup.defaultDb;
    }
    /**
     * Step 1: Start scraping trips
     * @param queue
     */
    async startScraping(queue) {
        const tripsToScrape = [];
        for (const [, provider] of Object.entries(SearchProviders)) {
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
        return this.updateDoc({ [provider]: results }, TripGroup);
    }
    /**
     * Step 3: Check for completion
     */
    isDone() {
        const TripGroupProviders = Object.keys(this.providers);
        const searchProviders = Object.keys(SearchProviders);
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
        for (const [, val] of Object.entries(this.providers)) {
            options.push(val.data);
        }
        return options.sort(TripGroup.SortPriceAsc);
    }
    bestTripFrom(provider) {
        return this.providers[provider].data.sort(TripGroup.SortPriceAsc)[0];
    }
    benchmarkTrip() {
        // TODO implement failure case
        // returns lowest google price
        return this.bestTripFrom(SearchProviders.GoogleFlights);
    }
}
exports.TripGroup = TripGroup;
TripGroup.defaultDb = database_1.Database.firebase;
TripGroup.Collection = firebase_1.Firebase.Collections.TripGroups;
TripGroup.SortPriceAsc = (a, b) => a.price - b.price;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC90cmlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQXNGO0FBQ3RGLHFDQUFxRDtBQUNyRCwwQ0FBdUM7QUFzQnZDLHdCQUF3QjtBQUN4QixJQUFZLG1CQVlYO0FBWkQsV0FBWSxtQkFBbUI7SUFDM0IsdUJBQXVCO0lBQ3ZCLG1FQUFPLENBQUE7SUFDUCxnQ0FBZ0M7SUFDaEMseUVBQVUsQ0FBQTtJQUNWLDBCQUEwQjtJQUMxQix1RUFBUyxDQUFBO0lBQ1Q7OztPQUdHO0lBQ0gsNkRBQUksQ0FBQTtBQUNSLENBQUMsRUFaVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQVk5QjtBQW9DRDs7Ozs7R0FLRztBQUNILElBQVksZUFFWDtBQUZELFdBQVksZUFBZTtJQUN2QiwyQ0FBd0IsQ0FBQTtBQUM1QixDQUFDLEVBRlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFFMUI7QUFFRCxNQUFhLFNBQVUsU0FBUSwwQkFBZTtJQWExQyxZQUFZLEtBQXNCO1FBQzlCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUhqQixlQUFVLEdBQUcsR0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztRQThEaEQsaUJBQVksR0FBRyxDQUFDLE1BQTJCLEVBQXNCLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFZMUcsYUFBUSxHQUFHLEdBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQXRFNUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBOEI7UUFDOUMsTUFBTSxhQUFhLEdBQXVCLEVBQUUsQ0FBQztRQUM3QyxLQUFLLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDeEQsYUFBYSxDQUFDLElBQUksaUNBQ1gsSUFBSSxDQUFDLEtBQUssS0FDYixRQUFRLEVBQ1IsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQ2hCLENBQUM7U0FDTjtRQUNELE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsUUFBeUIsRUFBRSxPQUF3QjtRQUMzRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU07UUFDRixNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFckQsd0NBQXdDO1FBQ3hDLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsTUFBTTtRQUNSLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2YsZ0JBQWdCO1lBQ2hCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxvQ0FBb0M7WUFDcEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLHFCQUFZLENBQUMsQ0FBQztZQUN4RixPQUFPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBSUQsZ0RBQWdEO0lBQ2hELGNBQWM7UUFDVixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbkIsd0JBQXdCO1FBQ3hCLEtBQUssTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbEQsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFJRCxZQUFZLENBQUMsUUFBeUI7UUFDbEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxhQUFhO1FBQ1QsOEJBQThCO1FBQzlCLDhCQUE4QjtRQUM5QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVELENBQUM7O0FBL0ZMLDhCQWdHQztBQTFGMkIsbUJBQVMsR0FBRyxtQkFBUSxDQUFDLFFBQVEsQ0FBQztBQUV0QyxvQkFBVSxHQUFHLG1CQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztBQUM3QyxzQkFBWSxHQUFHLENBQUMsQ0FBTyxFQUFFLENBQU8sRUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDIn0=