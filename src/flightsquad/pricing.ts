import { FirebaseDoc, Firebase } from '../agents';

export interface ValidPricingStrategyConfig {
    /**
     * breakpoint (number) maps to multipliers (number)
     */
    [breakpoint: string]: string;
}

const mapToNumber = (val: unknown): number => Number(val);

export const Discount = (origPrice: number, strategy: ValidPricingStrategyConfig, discountCode?: string): number => {
    if (discountCode) return Number(strategy[discountCode]) * origPrice;

    const breakpoints = Object.keys(strategy)
        .map(mapToNumber)
        .sort();
    const breakpoint = breakpoints.find(point => point >= origPrice);
    if (breakpoint === undefined) return origPrice;

    const multiplier = Number(strategy['' + breakpoint]);
    if (multiplier === Number.NaN) return origPrice;
    return multiplier * origPrice;
};

export class PricingStrategyConfig extends FirebaseDoc {
    strategy = (): ValidPricingStrategyConfig => this.data;
    constructor(docId: string, sheetName: string, db: Firebase) {
        super(`${docId}/${sheetName}`, db);
    }
}
