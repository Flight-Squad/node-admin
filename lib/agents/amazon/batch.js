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
                containerOverrides: {
                    environment: [
                        {
                            // Ensure container's NODE_ENV matches our's at runtime
                            // This will ensure that compatible env variables are loaded from EnvKey
                            name: 'NODE_ENV',
                            value: process.env.NODE_ENV,
                        },
                    ],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2FtYXpvbi9iYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUEwQjtBQXVCMUIsTUFBYSxVQUFVO0lBMkNuQixZQUFxQixLQUE0QjtRQUE1QixVQUFLLEdBQUwsS0FBSyxDQUF1QjtRQUR2QyxVQUFLLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQTFDckQsSUFBSSxDQUFDLElBQU8sRUFBRSxRQUF5RTtRQUNuRixNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQWlCLEVBQUUsSUFBaUMsRUFBUSxFQUFFO1lBQy9FLElBQUksUUFBUTtnQkFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQztRQUVGLElBQUk7WUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FDaEI7Z0JBQ0ksYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYTtnQkFDdkMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDN0IsVUFBVSxFQUFFO29CQUNSLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztpQkFDN0I7Z0JBQ0Qsa0JBQWtCLEVBQUU7b0JBQ2hCLFdBQVcsRUFBRTt3QkFDVDs0QkFDSSx1REFBdUQ7NEJBQ3ZELHdFQUF3RTs0QkFDeEUsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7eUJBQzlCO3FCQUNKO2lCQUNKO2FBQ0osRUFDRCxXQUFXLENBQ2QsQ0FBQztTQUNMO1FBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtJQUNsQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxJQUFTLEVBQUUsUUFBeUU7UUFDeEYsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDN0I7SUFDTCxDQUFDO0NBSUo7QUE1Q0QsZ0NBNENDIn0=