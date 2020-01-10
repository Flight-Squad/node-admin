import AWS from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import { Queue } from '../../queue';

export class SqsQueue<T> implements Queue<T> {
    push(data: T): void | never {
        return this.pushAll([data]);
    }

    pushAll(data: T[]): void | never {
        const params = {
            Entries: [],
            QueueUrl: this.queueUrl,
        };
        data.map(entry => {
            params.Entries.push({
                Id: uuidv4(),
                MessageBody: JSON.stringify(entry),
            });
        });
        this.sqs.sendMessageBatch(params, (err, res) => {
            if (err) {
                throw err;
            } else {
                if (res.Failed.length > 0) {
                    // TODO implement retry mechanism
                    throw new Error(`Failed ${res.Failed.length} requests`);
                }
                return res.Successful.length;
            }
        });
    }

    private readonly sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    constructor(readonly region: string, readonly queueUrl: string) {
        this.sqs.config.update({ region });
    }
}
