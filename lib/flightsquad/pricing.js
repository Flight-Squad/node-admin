"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_1 = require("../agents");
const mapToNumber = (val) => Number(val);
exports.Discount = (origPrice, strategy, discountCode) => {
    if (discountCode)
        return Number(strategy[discountCode]) * origPrice;
    const breakpoints = Object.keys(strategy)
        .map(mapToNumber)
        .filter(val => val !== Number.NaN)
        .sort();
    const breakpoint = breakpoints.find(point => point >= origPrice);
    // If price is higher than any set breakpoint
    if (breakpoint === undefined)
        return origPrice;
    const multiplier = Number(strategy['' + breakpoint]);
    if (multiplier === Number.NaN)
        return origPrice;
    return multiplier * origPrice;
};
class PricingStrategyConfig extends agents_1.FirebaseDoc {
    constructor(docId, sheetName, db) {
        super(`${docId}/${sheetName}`, db);
        this.strategy = () => {
            const cfg = {};
            for (const [key, val] of this.data) {
                cfg[key] = val.multiplier;
            }
            return cfg;
        };
    }
}
exports.PricingStrategyConfig = PricingStrategyConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC9wcmljaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBU2xELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBWSxFQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFN0MsUUFBQSxRQUFRLEdBQUcsQ0FBQyxTQUFpQixFQUFFLFFBQW9DLEVBQUUsWUFBcUIsRUFBVSxFQUFFO0lBQy9HLElBQUksWUFBWTtRQUFFLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVwRSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNwQyxHQUFHLENBQUMsV0FBVyxDQUFDO1NBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ2pDLElBQUksRUFBRSxDQUFDO0lBQ1osTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQztJQUVqRSw2Q0FBNkM7SUFDN0MsSUFBSSxVQUFVLEtBQUssU0FBUztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBRS9DLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDckQsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLEdBQUc7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNoRCxPQUFPLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBRUYsTUFBYSxxQkFBc0IsU0FBUSxvQkFBVztJQVNsRCxZQUFZLEtBQWEsRUFBRSxTQUFpQixFQUFFLEVBQVk7UUFDdEQsS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBVHZDLGFBQVEsR0FBRyxHQUErQixFQUFFO1lBQ3hDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNmLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNoQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQzthQUM3QjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO0lBSUYsQ0FBQztDQUNKO0FBWkQsc0RBWUMifQ==