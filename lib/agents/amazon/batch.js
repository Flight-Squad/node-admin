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
        // Bug with AWS Batch SDK, need to set region globally to define the Batch hostname
        aws_sdk_1.default.config.update({ region: props.region });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL2FtYXpvbi9iYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUEwQjtBQTZCMUIsTUFBYSxVQUFVO0lBaURuQixZQUFxQixLQUE0QjtRQUE1QixVQUFLLEdBQUwsS0FBSyxDQUF1QjtRQWR2QyxVQUFLLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRTlEOzs7V0FHRztRQUNPLGdCQUFXLEdBQTJDO1lBQzVEO2dCQUNJLHVEQUF1RDtnQkFDdkQsd0VBQXdFO2dCQUN4RSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTthQUM5QjtTQUNKLENBQUM7UUFFRSxtRkFBbUY7UUFDbkYsaUJBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNuRCxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDO0lBdkRELElBQUksQ0FBQyxJQUFPLEVBQUUsUUFBeUU7UUFDbkYsU0FBUyxXQUFXLENBQUMsR0FBaUIsRUFBRSxJQUFpQztZQUNyRSxJQUFJLFFBQVE7Z0JBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBSTtZQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUNoQjtnQkFDSSxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhO2dCQUN2QyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO2dCQUMzQixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2dCQUM3QixVQUFVLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2lCQUM3QjtnQkFDRCxrQkFBa0IsRUFBRTtvQkFDaEIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO2lCQUNoQzthQUNKLEVBQ0QsV0FBVyxDQUNkLENBQUM7U0FDTDtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7SUFDbEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsSUFBUyxFQUFFLFFBQXlFO1FBQ3hGLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztDQXdCSjtBQXpERCxnQ0F5REMifQ==