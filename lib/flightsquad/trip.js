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
        debug('group::isDone:: Finished Group Providers:');
        debug(TripGroupProviders);
        const searchProviders = Object.values(common_1.SearchProviders);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC90cmlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQXNGO0FBQ3RGLHFDQUF3QztBQUN4QywwQ0FBdUM7QUFHdkMsMENBQXdEO0FBQ3hELGlEQUE2RTtBQUU3RSxNQUFNLEtBQUssR0FBRyxvQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQVloRCx3QkFBd0I7QUFDeEIsSUFBWSxtQkFZWDtBQVpELFdBQVksbUJBQW1CO0lBQzNCLHVCQUF1QjtJQUN2QixtRUFBTyxDQUFBO0lBQ1AsZ0NBQWdDO0lBQ2hDLHlFQUFVLENBQUE7SUFDViwwQkFBMEI7SUFDMUIsdUVBQVMsQ0FBQTtJQUNUOzs7T0FHRztJQUNILDZEQUFJLENBQUE7QUFDUixDQUFDLEVBWlcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFZOUI7QUFjRCxNQUFhLFNBQVUsU0FBUSwwQkFBZTtJQXFCMUMsWUFBWSxLQUFzQjtRQUM5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFYakIsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFtRmhELGlCQUFZLEdBQUcsQ0FBQyxNQUEyQixFQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBWTFHLGFBQVEsR0FBRyxHQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFuRjVDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQzlDLENBQUM7SUFYRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQVksRUFBRSxFQUFVO1FBQ2hDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMs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