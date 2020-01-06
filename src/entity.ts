export interface ConfigFunc<EntityT, ConfigT> {
    (config: ConfigT): EntityT;
}

export interface ValidatorFunc {
    (...args): boolean | Promise<boolean>;
}
