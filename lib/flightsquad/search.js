"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../agents/firebase");
const database_1 = require("../database");
const trip_1 = require("./trip");
// import path from 'path';
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
})(FlightSearchStatus = exports.FlightSearchStatus || (exports.FlightSearchStatus = {}));
/**
 * Immutable object representing a flight search
 */
class FlightSearch extends firebase_1.FirestoreObject {
    constructor(props) {
        super(props);
        this.tripGroups = [];
        this.collection = () => FlightSearch.Collection;
        this.db = props.db || FlightSearch.db;
        this.returnDates = this.returnDates || []; // To avoid leaving returnDates undefined
        this.numTrips = this.origins.length * this.dests.length * this.departDates.length * this.returnDates.length;
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
        return this.updateDoc({ tripGroups: tripGroups.map(group => group.id), status: FlightSearchStatus.InProgress }, FlightSearch);
    }
    /**
     * Step 2:
     * Mark each trip group as complete
     * @param id id of trip group to add to list of completed trip groups
     */
    completeTripGroup(id) {
        this.tripGroups.push(id);
        return this.updateDoc({ tripGroups: this.tripGroups }, FlightSearch);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZsaWdodHNxdWFkL3NlYXJjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFzRjtBQUN0RiwwQ0FBdUM7QUFFdkMsaUNBQThFO0FBRTlFLDJCQUEyQjtBQUUzQixJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDbkIsbURBQU8sQ0FBQTtJQUNQLG1EQUFPLENBQUE7SUFDUCxxREFBUSxDQUFBO0FBQ1osQ0FBQyxFQUpXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBSXRCO0FBRUQsSUFBWSxrQkFLWDtBQUxELFdBQVksa0JBQWtCO0lBQzFCLHFFQUFTLENBQUE7SUFDVCx1RUFBVSxDQUFBO0lBQ1YsK0RBQU0sQ0FBQTtJQUNOLDJEQUFJLENBQUE7QUFDUixDQUFDLEVBTFcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFLN0I7QUE2QkQ7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSwwQkFBZTtJQWlCN0MsWUFBWSxLQUF5QjtRQUNqQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFSUixlQUFVLEdBQWEsRUFBRSxDQUFDO1FBS25DLGVBQVUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1FBSS9DLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyx5Q0FBeUM7UUFDcEYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNoSCxD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