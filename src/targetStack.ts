import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import * as logs from '@aws-cdk/aws-logs';
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

    new events.CfnEventBusPolicy(this, 'CrossAccountPolicy', {
      action: 'events:PutEvents',
      eventBusName: targetBus.eventBusName,
      principal: props.sourceAccountId,
      statementId: `AcceptFrom${props.sourceAccountId}`,
    });

    const eventLogs = new logs.LogGroup(this, 'EventLogs', {
      logGroupName: 'EventLogs',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_DAY,
    });

    new events.Rule(this, 'TestRule', {
      eventBus: targetBus,
      eventPattern: {
        detailType: ['TestEvent'],
      },
      targets: [
        new eventsTargets.CloudWatchLogGroup(eventLogs),
      ],
    });
  }
}
