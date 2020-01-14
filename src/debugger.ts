import debug from 'debug';

export const createDebugger = debug;

const flightSquadDebugger = createDebugger('flightsquad');
export const createFlightSquadDebugger = (mod: string): debug.Debugger => flightSquadDebugger.extend(mod);
