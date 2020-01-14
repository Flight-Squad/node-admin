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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC9haXJwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBbUJsRDs7R0FFRztBQUNILE1BQWEsYUFBYyxTQUFRLG9CQUFXO0lBQzFDLFlBQVksS0FBYSxFQUFFLFNBQWlCLEVBQUUsRUFBWTtRQUN0RCxLQUFLLENBQUMsR0FBRyxLQUFLLElBQUksU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHdkMsVUFBSyxHQUFHLENBQUMsUUFBZ0IsRUFBWSxFQUFFLENBQ25DLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNoQyxDQUFDLENBQUMseUJBQXlCO2dCQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQzlELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFOYixDQUFDO0NBT0o7QUFWRCxzQ0FVQyJ9