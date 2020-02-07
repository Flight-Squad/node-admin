import { Transaction } from '../transaction';
import { TransactionStatus, SearchProviders } from '@flight-squad/common';
import { expect } from 'chai';

describe('Transactions', () => {
    describe('ID Generation', () => {
        it('When creating a new Transaction, it generates a valid id', () => {
            const tx = new Transaction({
                status: TransactionStatus.Created,
                customer: { id: '', firstName: '', lastName: '', dob: '', stripe: '' },
                id: '',
                amount: 1,
                trip: {
                    price: 1,
                    stops: [],
                    query: { origin: '', departDate: '', dest: '', isRoundTrip: false, stops: 1 },
                    provider: SearchProviders.GoogleFlights,
                },
                db: null,
            });
            expect(Boolean(tx.id)).to.be.true;
            console.log('TX ID:', tx.id);
        });
    });
});
