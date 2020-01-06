import { ValidatorFunc } from '../entity';

export interface DbImplementation {
    // The FUCD methods
    find;
    update;
    create;
    delete;
}

export interface DbConnected<EntityT, QueryT, UpdatableFields> {
    create: (initData, ...args) => Promise<EntityT> | Promise<EntityT[]> | Promise<boolean>;
    del: (query: QueryT, ...args) => Promise<EntityT> | Promise<EntityT[]> | Promise<boolean>;
    find: QueryableFunc<EntityT, QueryT>;
    update(
        updateData: UpdatableFields,
        query: QueryT,
        ...args
    ): Promise<EntityT> | Promise<EntityT[]> | Promise<boolean>;
}

export interface Creatable<EntityT> {
    /**
     * Add an entity to a data store
     *
     * Return the entity added, or whether the addition was successful
     *
     * @param arg initial data to add to data store (Optional)
     */
    create(arg?): Promise<EntityT> | Promise<boolean>;
}

export interface Findable<EntityT, QueryT> {
    /**
     * Find at least one entity in data store based on its indentifier(s)
     * @param id indentifier(s) of the Entity -- Optional, e.g called on instance of the entity
     */
    find: QueryableFunc<EntityT, QueryT>;
}

export interface Updatable<EntityT, QueryT, UpdatableFields> {
    /**
     * Update an entity in data store
     * @param data
     * @param query
     */
    update(data: UpdatableFields, query?: QueryT): Promise<EntityT> | Promise<EntityT[]>;
}

export interface Deletable<EntityT, QueryT> {
    /**
     * Delete an Entity based on its identifier(s)
     * @param arg
     */
    del: QueryableFunc<EntityT, QueryT> | ValidatorFunc;
}

export interface QueryableFunc<EntityT, QueryT> {
    (query?: QueryT, ...args): Promise<EntityT> | Promise<EntityT[]>;
}
