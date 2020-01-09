import { Queue } from '../../queue';
export declare class SqsQueue<T> implements Queue<T> {
    readonly region: string;
    readonly queueUrl: string;
    push(data: T): void;
    pushAll(data: T[]): void;
    private readonly sqs;
    constructor(region: string, queueUrl: string);
}
