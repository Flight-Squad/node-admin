import { Queue } from '../../queue';
export declare class SqsQueue<T> implements Queue<T> {
    readonly region: string;
    readonly queueUrl: string;
    push(data: T): void | never;
    pushAll(data: T[]): void | never;
    private readonly sqs;
    constructor(region: string, queueUrl: string);
}
