import { FirebaseDoc, Firebase } from '../agents';
export interface ValidPricingStrategyConfig {
    /**
     * breakpoint (number) maps to multipliers (number)
     */
    [breakpoint: string]: string;
}
export declare const Discount: (origPrice: number, strategy: ValidPricingStrategyConfig, discountCode?: string) => number;
export declare class PricingStrategyConfig extends FirebaseDoc {
    strategy: () => ValidPricingStrategyConfig;
    constructor(docId: string, sheetName: string, db: Firebase);
}
