export interface ConfigFunc<EntityT, ConfigT> {
    (config: ConfigT): EntityT;
}
export interface ValidatorFunc {
    (...args: any[]): boolean | Promise<boolean>;
}
