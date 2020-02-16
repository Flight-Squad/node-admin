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
    /**
     * Array of key value pairs to override in container jobs
     */
    environment?: Array<{ name: string; value: string }>;
}

export class BatchQueue<T> implements Queue<T> {
    push(data: T, callback?: (err: AWS.AWSError, data: AWS.Batch.SubmitJobResponse) => void): void {
        function jobCallback(err: AWS.AWSError, data: AWS.Batch.SubmitJobResponse): void {
            if (callback) callback(err, data);
        }

        try {
            this.batch.submitJob(
                {
                    jobDefinition: this.props.jobDefinition,
                    jobName: this.props.jobName,
                    jobQueue: this.props.jobQueue,
                    parameters: {
                        data: JSON.stringify(data),
                    },
                    containerOverrides: {
                        environment: this.environment,
                    },
                },
                jobCallback,
            );
        } catch (e) {}
    }

    /**
     *
     * @param data
     * @param callback called for each item in `data`
     */
    pushAll(data: T[], callback?: (err: AWS.AWSError, data: AWS.Batch.SubmitJobResponse) => void): void {
        for (const item of data) {
            this.push(item, callback);
        }
    }

    protected batch = new AWS.Batch({ apiVersion: '2016-08-10' });

    /**
     * Any environment overrides passed in through the constructor will
     * be added to this array.
     */
    protected environment: Array<{ name: string; value: string }> = [
        {
            // Ensure container's NODE_ENV matches our's at runtime
            // This will ensure that compatible env variables are loaded from EnvKey
            name: 'NODE_ENV',
            value: process.env.NODE_ENV,
        },
    ];
    constructor(readonly props: BatchQueueIdentifiers) {
        if (props.environment) {
            this.environment.push(...props.environment);
        }
    }
}
