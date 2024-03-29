"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
const database_1 = require("../database");
const trip_1 = require("./trip");
const debugger_1 = require("../debugger");
const common_1 = require("@flight-squad/common");
exports.FlightStops = common_1.FlightStops;
// import path from 'path';
const debug = debugger_1.createFlightSquadDebugger('search');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZsaWdodHNxdWFkL3NlYXJjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFzRjtBQUN0RiwwQ0FBdUM7QUFFdkMsaUNBQXdFO0FBRXhFLDBDQUF3RDtBQUN4RCxpREFBeUQ7QUFLaEQsc0JBTE0sb0JBQVcsQ0FLTjtBQUpwQiwyQkFBMkI7QUFFM0IsTUFBTSxLQUFLLEdBQUcsb0NBQXlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFJbEQsSUFBWSxrQkFNWDtBQU5ELFdBQVksa0JBQWtCO0lBQzFCLHFFQUFTLENBQUE7SUFDVCx1RUFBVSxDQUFBO0lBQ1YsK0RBQU0sQ0FBQTtJQUNOLDJEQUFJLENBQUE7SUFDSiw2REFBSyxDQUFBO0FBQ1QsQ0FBQyxFQU5XLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBTTdCO0FBNkJEOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsMEJBQWU7SUF5QjdDLFlBQVksS0FBeUI7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBWGpCLGVBQVUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1FBWS9DLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyx5Q0FBeUM7UUFDcEYsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUTtZQUNULElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcs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