"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
const search_1 = require("./search");
const database_1 = require("../database");
const debugger_1 = require("../debugger");
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
        debug('Starting Scraping: Trip Groups %s', this.id);
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
        debug('Adding provider %s to group %s', provider, this.id);
        return this.updateDoc({ providers: { [provider]: results } }, TripGroup);
    }
    /**
     * Step 3: Check for completion
     */
    isDone() {
        const TripGroupProviders = Object.keys(this.providers);
        const searchProviders = Object.values(SearchProviders);
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
        return this.bestTripFrom(SearchProviders.GoogleFlights);
    }
}
exports.TripGroup = TripGroup;
TripGroup.defaultDb = database_1.Database.firebase;
TripGroup.Collection = firebase_1.Firebase.Collections.TripGroups;
TripGroup.SortPriceAsc = (a, b) => a.price - b.price;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC90cmlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQXNGO0FBQ3RGLHFDQUFxRDtBQUNyRCwwQ0FBdUM7QUFJdkMsMENBQXdEO0FBRXhELE1BQU0sS0FBSyxHQUFHLG9DQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBbUJoRCx3QkFBd0I7QUFDeEIsSUFBWSxtQkFZWDtBQVpELFdBQVksbUJBQW1CO0lBQzNCLHVCQUF1QjtJQUN2QixtRUFBTyxDQUFBO0lBQ1AsZ0NBQWdDO0lBQ2hDLHlFQUFVLENBQUE7SUFDViwwQkFBMEI7SUFDMUIsdUVBQVMsQ0FBQTtJQUNUOzs7T0FHRztJQUNILDZEQUFJLENBQUE7QUFDUixDQUFDLEVBWlcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFZOUI7QUFvQ0Q7Ozs7O0dBS0c7QUFDSCxJQUFZLGVBRVg7QUFGRCxXQUFZLGVBQWU7SUFDdkIsMkNBQXdCLENBQUE7QUFDNUIsQ0FBQyxFQUZXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBRTFCO0FBRUQsTUFBYSxTQUFVLFNBQVEsMEJBQWU7SUFhMUMsWUFBWSxLQUFzQjtRQUM5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFIakIsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFpRWhELGlCQUFZLEdBQUcsQ0FBQyxNQUEyQixFQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBWTFHLGFBQVEsR0FBRyxHQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUF6RTVDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FB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