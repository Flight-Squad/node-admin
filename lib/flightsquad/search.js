"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
const database_1 = require("../database");
const trip_1 = require("./trip");
const debugger_1 = require("../debugger");
// import path from 'path';
const debug = debugger_1.createFlightSquadDebugger('search');
var FlightStops;
(function (FlightStops) {
    FlightStops[FlightStops["NonStop"] = 0] = "NonStop";
    FlightStops[FlightStops["OneStop"] = 1] = "OneStop";
    FlightStops[FlightStops["AnyStops"] = 2] = "AnyStops";
})(FlightStops = exports.FlightStops || (exports.FlightStops = {}));
var FlightSearchStatus;
(function (FlightSearchStatus) {
    FlightSearchStatus[FlightSearchStatus["Requested"] = 0] = "Requested";
    FlightSearchStatus[FlightSearchStatus["InProgress"] = 1] = "InProgress";
    FlightSearchStatus[FlightSearchStatus["Halted"] = 2] = "Halted";
    FlightSearchStatus[FlightSearchStatus["Done"] = 3] = "Done";
    FlightSearchStatus[FlightSearchStatus["Error"] = 4] = "Error";
})(FlightSearchStatus = exports.FlightSearchStatus || (exports.FlightSearchStatus = {}));
/**
 * Immutable object representing a flight search
 */
class FlightSearch extends firebase_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.collection = () => FlightSearch.Collection;
        this.db = props.db || FlightSearch.db;
        this.returnDates = this.returnDates || []; // To avoid leaving returnDates undefined
        this.tripGroups = this.tripGroups || [];
        this.numTrips =
            this.origins.length * this.dests.length * this.departDates.length * (this.returnDates.length || 1);
    }
    static find(db, id) {
        return db.find(FlightSearch.Collection, id, FlightSearch);
    }
    find(id) {
        return FlightSearch.find(this.db, id);
    }
    /**
     * Creates a Flight Search
     *
     * Does not write to db
     * @param query
     * @param meta
     * @param db
     */
    static make(query, meta, db) {
        return new FlightSearch(Object.assign(Object.assign({}, query), { db, id: '', status: FlightSearchStatus.Requested, meta }));
    }
    /**
     * Pre-Condition: this search has been added to database
     *
     * Step 1: Start search for flights
     * @param queue Queue to add scraping requests to
     */
    async start(queue) {
        // Enqueue all scraping requests
        const tripGroups = await Promise.all(this.createTripGroups());
        await Promise.all(tripGroups.map(async (group) => group.startScraping(queue)));
        // Update status and tripGroups
        return this.updateDoc({ status: FlightSearchStatus.InProgress }, FlightSearch);
    }
    /**
     * Step 2:
     * Mark each trip group as complete
     * @param id id of trip group to add to list of completed trip groups
     */
    completeTripGroup(id) {
        this.tripGroups.push(id);
        debug('completing trip %o', { trip: id, tripGroups: this.tripGroups });
        return this.updateDoc({}, FlightSearch);
    }
    /**
     * Step 3: Check if search has completed
     */
    isDone() {
        return this.tripGroups.length === this.numTrips;
    }
    /**
     * Step 4: Update status
     * @param status
     */
    updateStatus(status) {
        return this.updateDoc({ status }, FlightSearch);
    }
    /**
     * Step 5: Get best trip from search results and make a transaction with it
     */
    async bestTrip() {
        const tripGroups = await Promise.all(this.tripGroups.map(id => this.db.find(trip_1.TripGroup.Collection, id, trip_1.TripGroup)));
        const bestTrips = tripGroups.map(group => group.bestTrip());
        // return lowest priced trip
        return bestTrips.sort(trip_1.TripGroup.SortPriceAsc)[0];
    }
    createTripGroups() {
        const queries = this.tripQueries();
        return queries.map(query => new trip_1.TripGroup({
            query,
            status: trip_1.TripGroupProcStatus.Waiting,
            providers: {},
            searchId: this.id,
            db: this.db,
            id: '',
        }).createDoc());
    }
    tripQueries() {
        const groups = [];
        for (const origin of this.origins) {
            for (const dest of this.dests) {
                for (const departDate of this.departDates) {
                    groups.push({
                        origin,
                        dest,
                        departDate,
                        isRoundTrip: this.isRoundTrip,
                        stops: this.stops,
                    });
                }
            }
        }
        if (this.returnDates && this.isRoundTrip) {
            const newGroups = [];
            for (const group of groups) {
                for (const returnDate of this.returnDates) {
                    newGroups.push(Object.assign(Object.assign({}, group), { returnDate }));
                }
            }
            return newGroups;
        }
        return groups;
    }
}
exports.FlightSearch = FlightSearch;
FlightSearch.db = database_1.Database.firebase;
FlightSearch.Collection = firebase_1.Firebase.Collections.Searches;
// TODO: Move to integration test
// const firebase = Firebase.init({
//     firebaseUrl: process.env.FIREBASE_URL,
//     serviceAccount: process.env.FS_CONFIG,
//     serviceAccountPath: path.resolve(__dirname, './serviceAccount.json'),
// });
// const cfg: FlightSearchFields = {
//     origins: ['BWI'],
//     dests: ['BOS'],
//     db: firebase,
//     departDates: [new Date()],
//     isRoundTrip: false,
//     status: FlightSearchStatus.Requested,
//     stops: FlightStops.AnyStops,
//     id: 'test-search-1',
//     coll: 'test_searches',
// };
// const search = new FlightSearch(cfg);
// search.createDoc();
// console.log(JSON.stringify(search.data(), null, 2));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZsaWdodHNxdWFkL3NlYXJjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFzRjtBQUN0RiwwQ0FBdUM7QUFFdkMsaUNBQXdFO0FBRXhFLDBDQUF3RDtBQUV4RCwyQkFBMkI7QUFFM0IsTUFBTSxLQUFLLEdBQUcsb0NBQXlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFbEQsSUFBWSxXQUlYO0FBSkQsV0FBWSxXQUFXO0lBQ25CLG1EQUFPLENBQUE7SUFDUCxtREFBTyxDQUFBO0lBQ1AscURBQVEsQ0FBQTtBQUNaLENBQUMsRUFKVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUl0QjtBQUVELElBQVksa0JBTVg7QUFORCxXQUFZLGtCQUFrQjtJQUMxQixxRUFBUyxDQUFBO0lBQ1QsdUVBQVUsQ0FBQTtJQUNWLCtEQUFNLENBQUE7SUFDTiwyREFBSSxDQUFBO0lBQ0osNkRBQUssQ0FBQTtBQUNULENBQUMsRUFOVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQU03QjtBQTZCRDs7R0FFRztBQUNILE1BQWEsWUFBYSxTQUFRLDBCQUFlO0lBeUI3QyxZQUFZLEtBQXlCO1FBQ2pDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQVhqQixlQUFVLEdBQUcsR0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQVkvQyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUMseUNBQXlDO1FBQ3BGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVE7WUFDVCxJQUFJLENBQUMsT0FBTyxDQUFD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