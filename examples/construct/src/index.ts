import * as path from 'path';
import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';


export interface ExampleProps {
  /**
   * The visibility timeout to be configured on the SQS Queue, in seconds.
   *
   * @default Duration.seconds(300)
   */
  visibilityTimeout?: cdk.Duration;
}

export class Example extends cdk.Construct {
  /** @returns the ARN of the SQS queue */
  public readonly queueArn: string;

  constructor(scope: cdk.Construct, id: string, props: ExampleProps = {}) {
    super(scope, id);

    const queue = new sqs.Queue(this, 'ExampleQueue', {
      visibilityTimeout: props.visibilityTimeout || cdk.Duration.seconds(300),
    });

    const topic = new sns.Topic(this, 'ExampleTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    this.queueArn = queue.queueArn;

    new Function(this, 'Test1Function', {
      runtime: Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambdas', 'test1')),
    });

    new Function(this, 'Test2Function', {
      runtime: Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambdas', 'test2')),
    });
  }
}