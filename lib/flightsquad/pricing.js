"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_1 = require("../agents");
const mapToNumber = (val) => Number(val);
exports.Discount = (origPrice, strategy, discountCode) => {
    if (discountCode)
        return Number(strategy[discountCode]) * origPrice;
    const breakpoints = Object.keys(strategy)
        .map(mapToNumber)
        .sort();
    const breakpoint = breakpoints.find(point => point >= origPrice);
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
        this.strategy = () => this.data;
    }
}
exports.PricingStrategyConfig = PricingStrategyConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbGlnaHRzcXVhZC9wcmljaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBU2xELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBWSxFQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFN0MsUUFBQSxRQUFRLEdBQUcsQ0FBQyxTQUFpQixFQUFFLFFBQW9DLEVBQUUsWUFBcUIsRUFBVSxFQUFFO0lBQy9HLElBQUksWUFBWTtRQUFFLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVwRSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNwQyxHQUFHLENBQUMsV0FBVyxDQUFDO1NBQ2hCLElBQUksRUFBRSxDQUFDO0lBQ1osTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQztJQUNqRSxJQUFJLFVBQVUsS0FBSyxTQUFTO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFFL0MsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNyRCxJQUFJLFVBQVUsS0FBSyxNQUFNLENBQUMsR0FBRztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQ2hELE9BQU8sVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFRixNQUFhLHFCQUFzQixTQUFRLG9CQUFXO0lBRWxELFlBQVksS0FBYSxFQUFFLFNBQWlCLEVBQUUsRUFBWTtRQUN0RCxLQUFLLENBQUMsR0FBRyxLQUFLLElBQUksU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFGdkMsYUFBUSxHQUFHLEdBQStCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBR3ZELENBQUM7Q0FDSjtBQUxELHNEQUtDIn0=