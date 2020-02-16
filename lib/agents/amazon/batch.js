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
        /**
         * Any environment overrides passed in through the constructor will
         * be added to this array.
         */
        this.environment = [
            {
                // Ensure container's NODE_ENV matches our's at runtime
                // This will ensure that compatible env variables are loaded from EnvKey
                name: 'NODE_ENV',
                value: process.env.NODE_ENV,
            },
        ];
        this.batch.config.update({ region: props.region });
        if (props.environment) {
            this.environment.push(...props.environment);
        }
    }
    push(data, callback) {
        function jobCallback(err, data) {
            if (callback)
                callback(err, data);
        }
        try {
            this.batch.submitJob({
                jobDefinition: this.props.jobDefinition,
                jobName: this.props.jobName,
                jobQueue: this.props.jobQueue,
                parameters: {
                    data: JSON.stringify(data),
                },
                containerOverrides: {
                    environment: this.environment,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2FtYXpvbi9iYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUEwQjtBQTZCMUIsTUFBYSxVQUFVO0lBaURuQixZQUFxQixLQUE0QjtRQUE1QixVQUFLLEdBQUwsS0FBSyxDQUF1QjtRQWR2QyxVQUFLLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRTlEOzs7V0FHRztRQUNPLGdCQUFXLEdBQTJDO1lBQzVEO2dCQUNJLHVEQUF1RDtnQkFDdkQsd0VBQXdFO2dCQUN4RSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTthQUM5QjtTQUNKLENBQUM7UUFFRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkQsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQztJQXJERCxJQUFJLENBQUMsSUFBTyxFQUFFLFFBQXlFO1FBQ25GLFNBQVMsV0FBVyxDQUFDLEdBQWlCLEVBQUUsSUFBaUM7WUFDckUsSUFBSSxRQUFRO2dCQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELElBQUk7WUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FDaEI7Z0JBQ0ksYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYTtnQkFDdkMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDN0IsVUFBVSxFQUFFO29CQUNSLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztpQkFDN0I7Z0JBQ0Qsa0JBQWtCLEVBQUU7b0JBQ2hCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztpQkFDaEM7YUFDSixFQUNELFdBQVcsQ0FDZCxDQUFDO1NBQ0w7UUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO0lBQ2xCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLElBQVMsRUFBRSxRQUF5RTtRQUN4RixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM3QjtJQUNMLENBQUM7Q0FzQko7QUF2REQsZ0NBdURDIn0=