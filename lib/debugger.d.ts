import debug from 'debug';
export declare const createDebugger: debug.Debug & {
    debug: debug.Debug;
    default: debug.Debug;
};
export declare const createFlightSquadDebugger: (mod: string) => debug.Debugger;
