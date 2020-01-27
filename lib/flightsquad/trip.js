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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC90cmlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQXNGO0FBQ3RGLHFDQUF3QztBQUN4QywwQ0FBdUM7QUFHdkMsMENBQXdEO0FBQ3hELGlEQUE2RTtBQUU3RSxNQUFNLEtBQUssR0FBRyxvQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQVloRCx3QkFBd0I7QUFDeEIsSUFBWSxtQkFZWDtBQVpELFdBQVksbUJBQW1CO0lBQzNCLHVCQUF1QjtJQUN2QixtRUFBTyxDQUFBO0lBQ1AsZ0NBQWdDO0lBQ2hDLHlFQUFVLENBQUE7SUFDViwwQkFBMEI7SUFDMUIsdUVBQVMsQ0FBQTtJQUNUOzs7T0FHRztJQUNILDZEQUFJLENBQUE7QUFDUixDQUFDLEVBWlcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFZOUI7QUFjRCxNQUFhLFNBQVUsU0FBUSwwQkFBZTtJQXFCMUMsWUFBWSxLQUFzQjtRQUM5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFYakIsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUEyRWhELGlCQUFZLEdBQUcsQ0FBQyxNQUEyQixFQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBWTFHLGFBQVEsR0FBRyxHQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUEzRTVDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQzlDLENBQUM7SUFYRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQVksRUFBRSxFQUFVO1FBQ2hDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMs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