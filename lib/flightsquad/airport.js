"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_1 = require("../agents");
/**
 * Maps a location to a comma separated list of airport iata codes
 */
class AirportLocMap extends agents_1.FirebaseDoc {
    constructor(docId, sheetName, db) {
        super(`${docId}/${sheetName}`, db);
        this.iatas = (location) => this.loaded() && this.data[location]
            ? // Filter out empty items
                this.data[location].airports.split(',').filter(item => item)
            : [];
    }
}
exports.AirportLocMap = AirportLocMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC9haXJwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBV2xEOztHQUVHO0FBQ0gsTUFBYSxhQUFjLFNBQVEsb0JBQVc7SUFDMUMsWUFBWSxLQUFhLEVBQUUsU0FBaUIsRUFBRSxFQUFZO1FBQ3RELEtBQUssQ0FBQyxHQUFHLEtBQUssSUFBSSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUd2QyxVQUFLLEdBQUcsQ0FBQyxRQUFnQixFQUFZLEVBQUUsQ0FDbkMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ2hDLENBQUMsQ0FBQyx5QkFBeUI7Z0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDOUQsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQU5iLENBQUM7Q0FPSjtBQVZELHNDQVVDIn0=