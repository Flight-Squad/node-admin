import AWS from 'aws-sdk';
import { Queue } from '../../queue';
export interface BatchQueueIdentifiers {
    /**
     * The job definition used by this job queue.
     * This value can be either a `name:revision` or the
     * Amazon Resource Name (ARN) for the job definition.
     */
    jobDefinition: string;
    /**
     * The name of the job represented in this job queue.
     * The first character must be alphanumeric, and up to 128 letters
     * (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     */
    jobName: string;
    /**
     * The job queue into which the job is submitted.
     * You can specify either the name or the Amazon Resource Name (ARN) of the queue.
     */
    jobQueue: string;
}
export declare class BatchQueue<T> implements Queue<T> {
    readonly props: BatchQueueIdentifiers;
    push(data: T, callback?: (err: AWS.AWSError, data: AWS.Batch.SubmitJobResponse) => void): void;
    /**
     *
     * @param data
     * @param callback called for each item in `data`
     */
    pushAll(data: T[], callback?: (err: AWS.AWSError, data: AWS.Batch.SubmitJobResponse) => void): void;
    protected batch: AWS.Batch;
    constructor(props: BatchQueueIdentifiers);
}
