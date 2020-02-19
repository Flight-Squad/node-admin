"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScraperDataTargets;
(function (ScraperDataTargets) {
    ScraperDataTargets["Customer"] = "customer";
    ScraperDataTargets["DatabaseOnly"] = "database_only";
})(ScraperDataTargets = exports.ScraperDataTargets || (exports.ScraperDataTargets = {}));
class ScraperQueryHandler {
    constructor(Db, config) {
        this.Db = Db;
        this.config = config;
    }
    async push(data) {
        await this.Db.firestore
            .collection('scraper_queries')
            .doc()
            .create(Object.assign(Object.assign({}, data), { config: this.config }));
    }
    async pushAll(data) {
        for (const item of data) {
            await this.push(item);
        }
    }
}
exports.ScraperQueryHandler = ScraperQueryHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC9zY3JhcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBVUEsSUFBWSxrQkFHWDtBQUhELFdBQVksa0JBQWtCO0lBQzFCLDJDQUFxQixDQUFBO0lBQ3JCLG9EQUE4QixDQUFBO0FBQ2xDLENBQUMsRUFIVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQUc3QjtBQWtCRCxNQUFhLG1CQUFtQjtJQWlCNUIsWUFBcUIsRUFBWSxFQUFXLE1BQW1CO1FBQTFDLE9BQUUsR0FBRixFQUFFLENBQVU7UUFBVyxXQUFNLEdBQU4sTUFBTSxDQUFhO0lBQUcsQ0FBQztJQWhCbkUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFzQjtRQUM3QixNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUzthQUNsQixVQUFVLENBQUMsaUJBQWlCLENBQUM7YUFDN0IsR0FBRyxFQUFFO2FBQ0wsTUFBTSxpQ0FDQSxJQUFJLEtBQ1AsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQ3JCLENBQUM7SUFDWCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUF3QjtRQUNsQyxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRTtZQUNyQixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekI7SUFDTCxDQUFDO0NBR0o7QUFsQkQsa0RBa0JDIn0=