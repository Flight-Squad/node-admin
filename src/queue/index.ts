export interface Queue<T> {
    push(data: T, ...args);
    pushAll(data: T[], ...args);
}
