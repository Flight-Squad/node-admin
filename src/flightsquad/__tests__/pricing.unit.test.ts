import { expect } from 'chai';
import { Discount } from '../pricing';

describe('Pricing Strategy', () => {
    describe('Custom Discount', () => {
        it('When provided with a discount code, the strategy applies the appropriate discount', () => {
            const origPrice = 100.0;
            const multiplier = 0.85;
            const discountCode = 'FlyFree';
            const expectedResult = origPrice * multiplier;
            const start = process.hrtime();
            const result = Discount(
                origPrice,
                {
                    '20': '0',
                    '700': '0',
                    '34': '0',
                    '99': '0',
                    '100': '0',
                    '102': '0',
                    [discountCode]: multiplier + '',
                },
                discountCode,
            );
            const end = process.hrtime(start);
            console.log(`Finished after ${end[0]}.${end[1]}s`);
            expect(result).to.equal(expectedResult);
        });

        it('When given full range of manual breakpoints, the strategy applies the appropriate discount', () => {
            const origPrice = 100.0;
            const multiplier = 0.85;
            const expectedResult = origPrice * multiplier;
            const start = process.hrtime();
            const result = Discount(origPrice, {
                // Test sorting
                '20': '0',
                '700': '0',
                '34': '0',
                // test edge cases
                '99': '0',
                '100': multiplier + '',
                '102': '0',
                // Randos for sorting
                '89': '0',
                '897': '0',
                '83': '0',
                '21': '0',
            });
            const end = process.hrtime(start);
            console.log(`Finished after ${end[0]}.${end[1]}s`);
            expect(result).to.equal(expectedResult);
        });

        it('When given range of breakpoints less than original price, the strategy returns the original price', () => {
            const origPrice = 100.0;
            const start = process.hrtime();
            const result = Discount(origPrice, {
                // Test sorting
                '20': '0',
                '34': '0',
                // test edge cases
                '99': '0',
            });
            const end = process.hrtime(start);
            console.log(`Finished after ${end[0]}.${end[1]}s`);
            expect(result).to.equal(origPrice);
        });

        it('When given range of breakpoints greater than original price, the strategy applies discount from lowest breakpoint', () => {
            const origPrice = 100.0;
            const multiplier = 0.85;
            const expectedResult = origPrice * multiplier;
            const start = process.hrtime();
            const result = Discount(origPrice, {
                // Test sorting
                '200': '' + multiplier,
                '340': '0',
                // test edge cases
                '990': '0',
            });
            const end = process.hrtime(start);
            console.log(`Finished after ${end[0]}.${end[1]}s`);
            expect(result).to.equal(expectedResult);
        });

        it('When given breakpoint equal to original price, the strategy applies its discount', () => {
            const origPrice = 100.0;
            const multiplier = 0.85;
            const expectedResult = origPrice * multiplier;
            const start = process.hrtime();
            const result = Discount(origPrice, {
                // Test sorting
                '100': '' + multiplier,
            });
            const end = process.hrtime(start);
            console.log(`Finished after ${end[0]}.${end[1]}s`);
            expect(result).to.equal(expectedResult);
        });

        it('When provided with nothing, the strategy returns the original price', () => {
            const origPrice = 100.0;
            const start = process.hrtime();
            const result = Discount(origPrice, {});
            const end = process.hrtime(start);
            console.log(`Finished after ${end[0]}.${end[1]}s`);
            expect(result).to.equal(origPrice);
        });
    });
});
