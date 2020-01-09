# Flow of Flight Search

## Part 1: Customer creates a search

`export * from './customer';`

## Part 2: Control the search

`export * from './search';`

## Part 3: Control the trip

`export * from './trip';`

### Trip Dependencies

`export * from './scraper';`

`export * from './airport';`

## Part 5: Create Transaction from Trip

`export * from './transaction';`

# Tips

Pass empty tring for `id` field to contructor of any object that extends `FirestoreObject` to auto-generate a unique uuid.
