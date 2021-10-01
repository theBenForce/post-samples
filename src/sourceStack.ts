import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import * as cdk from '@aws-cdk/core';

interface SourceStackProps extends cdk.StackProps {
  targetBus: events.EventBus;
}

export class SourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: SourceStackProps) {
    super(scope, id, props);

    const sourceBus = new events.EventBus(this, 'SourceBus');

    new events.Rule(this, 'TestRule', {
      eventBus: sourceBus,
      eventPattern: {
        detailType: ['TestEvent'],
      },
      targets: [
        new eventsTargets.EventBus(props.targetBus),
      ],
    });
  }
}