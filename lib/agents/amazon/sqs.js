"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const v4_1 = __importDefault(require("uuid/v4"));
class SqsQueue {
    constructor(region, queueUrl) {
        this.region = region;
        this.queueUrl = queueUrl;
        this.sqs = new aws_sdk_1.default.SQS({ apiVersion: '2012-11-05' });
        this.sqs.config.update({ region });
    }
    push(data) {
        return this.pushAll([data]);
    }
    pushAll(data) {
        const params = {
            Entries: [],
            QueueUrl: this.queueUrl,
        };
        data.map(entry => {
            params.Entries.push({
                Id: v4_1.default(),
                MessageBody: JSON.stringify(entry),
            });
        });
        this.sqs.sendMessageBatch(params, (err, res) => {
            if (err) {
                throw err;
            }
            else {
                if (res.Failed.length > 0) {
                    // TODO implement retry mechanism
                    throw new Error(`Failed ${res.Failed.length} requests`);
                }
                return res.Successful.length;
            }
        });
    }
}
exports.SqsQueue = SqsQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FnZW50cy9hbWF6b24vc3FzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTBCO0FBQzFCLGlEQUE2QjtBQUc3QixNQUFhLFFBQVE7SUE4QmpCLFlBQXFCLE1BQWMsRUFBVyxRQUFnQjtRQUF6QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUQ3QyxRQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQS9CRCxJQUFJLENBQUMsSUFBTztRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFTO1FBQ2IsTUFBTSxNQUFNLEdBQUc7WUFDWCxPQUFPLEVBQUUsRUFBRTtZQUNYLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUMxQixDQUFDO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNiLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNoQixFQUFFLEVBQUUsWUFBTSxFQUFFO2dCQUNaLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQzthQUNyQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzNDLElBQUksR0FBRyxFQUFFO2dCQUNMLE1BQU0sR0FBRyxDQUFDO2FBQ2I7aUJBQU07Z0JBQ0gsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3ZCLGlDQUFpQztvQkFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxXQUFXLENBQUMsQ0FBQztpQkFDM0Q7Z0JBQ0QsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzthQUNoQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQU1KO0FBakNELDRCQWlDQyJ9