"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class BatchQueue {
    constructor(props) {
        this.props = props;
        this.batch = new aws_sdk_1.default.Batch({ apiVersion: '2016-08-10' });
    }
    push(data, callback) {
        const jobCallback = (err, data) => {
            if (callback)
                callback(err, data);
        };
        try {
            this.batch.submitJob({
                jobDefinition: this.props.jobDefinition,
                jobName: this.props.jobName,
                jobQueue: this.props.jobQueue,
                parameters: {
                    data: JSON.stringify(data),
                },
            }, jobCallback);
        }
        catch (e) { }
    }
    /**
     *
     * @param data
     * @param callback called for each item in `data`
     */
    pushAll(data, callback) {
        for (const item of data) {
            this.push(item, callback);
        }
    }
}
exports.BatchQueue = BatchQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2FtYXpvbi9iYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUEwQjtBQXVCMUIsTUFBYSxVQUFVO0lBaUNuQixZQUFxQixLQUE0QjtRQUE1QixVQUFLLEdBQUwsS0FBSyxDQUF1QjtRQUR2QyxVQUFLLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQWhDckQsSUFBSSxDQUFDLElBQU8sRUFBRSxRQUF5RTtRQUNuRixNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQWlCLEVBQUUsSUFBaUMsRUFBUSxFQUFFO1lBQy9FLElBQUksUUFBUTtnQkFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQztRQUVGLElBQUk7WUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FDaEI7Z0JBQ0ksYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYTtnQkFDdkMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDN0IsVUFBVSxFQUFFO29CQUNSLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztpQkFDN0I7YUFDSixFQUNELFdBQVcsQ0FDZCxDQUFDO1NBQ0w7UUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO0lBQ2xCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLElBQVMsRUFBRSxRQUF5RTtRQUN4RixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM3QjtJQUNMLENBQUM7Q0FJSjtBQWxDRCxnQ0FrQ0MifQ==