"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScraperDataTargets;
(function (ScraperDataTargets) {
    ScraperDataTargets["Customer"] = "customer";
    ScraperDataTargets["DatabaseOnly"] = "database_only";
})(ScraperDataTargets = exports.ScraperDataTargets || (exports.ScraperDataTargets = {}));
class ScraperQueueHandler {
    constructor(Db, config) {
        this.Db = Db;
        this.config = config;
    }
    async push(data) {
        await this.Db.firestore
            .collection(ScraperQueueHandler.Collection)
            .doc()
            .create(Object.assign(Object.assign({}, data), { config: this.config }));
    }
    async pushAll(data) {
        for (const item of data) {
            await this.push(item);
        }
    }
}
exports.ScraperQueueHandler = ScraperQueueHandler;
ScraperQueueHandler.Collection = 'scraper_queries';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC9zY3JhcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBVUEsSUFBWSxrQkFHWDtBQUhELFdBQVksa0JBQWtCO0lBQzFCLDJDQUFxQixDQUFBO0lBQ3JCLG9EQUE4QixDQUFBO0FBQ2xDLENBQUMsRUFIVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQUc3QjtBQWtCRCxNQUFhLG1CQUFtQjtJQW1CNUIsWUFBcUIsRUFBWSxFQUFXLE1BQW1CO1FBQTFDLE9BQUUsR0FBRixFQUFFLENBQVU7UUFBVyxXQUFNLEdBQU4sTUFBTSxDQUFhO0lBQUcsQ0FBQztJQWxCbkUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFzQjtRQUM3QixNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUzthQUNsQixVQUFVLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDO2FBQzFDLEdBQUcsRUFBRTthQUNMLE1BQU0saUNBQ0EsSUFBSSxLQUNQLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUNyQixDQUFDO0lBQ1gsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBd0I7UUFDbEMsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDckIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQzs7QUFmTCxrREFvQkM7QUFIbUIsOEJBQVUsR0FBRyxpQkFBaUIsQ0FBQyJ9