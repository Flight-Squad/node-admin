/*
    These are interfaces that I don't know where to put.
    I think these should be moved to @flight-squad/common
    because they aren't logically coupled to third-party admin
    libraries.
 */

export interface ConfigFunc<EntityT, ConfigT> {
    (config: ConfigT): EntityT;
}

export interface ValidatorFunc {
    (...args): boolean | Promise<boolean>;
}
