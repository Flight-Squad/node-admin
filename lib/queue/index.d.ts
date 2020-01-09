export interface Queue<T> {
    push(data: T, ...args: any[]): any;
    pushAll(data: T[], ...args: any[]): any;
}
