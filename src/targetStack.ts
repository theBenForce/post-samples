import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

interface TargetStackProps extends cdk.StackProps {
  sourceAccountId: string;
}

export class TargetStack extends cdk.Stack {

  bus: events.EventBus;

  constructor(scope: cdk.Construct, id: string, props: TargetStackProps) {
    super(scope, id, props);

    const targetBus = new events.EventBus(this, 'TargetBus', {
      eventBusName: 'TargetBus',
    });

    targetBus._enableCrossEnvironment();
    this.bus = targetBus;

    targetBus.grantPutEventsTo(new iam.AccountPrincipal(props.sourceAccountId));

    new events.Rule(this, 'TestRule', {
      eventBus: targetBus,
      eventPattern: {
        detailType: ['TestEvent'],
      },
    });
  }
}
