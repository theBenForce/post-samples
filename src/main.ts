import * as cdk from '@aws-cdk/core';
import { SourceStack } from './sourceStack';
import { TargetStack } from './targetStack';

const app = new cdk.App();

const targetAccount = app.node.tryGetContext('TargetAccount') as string;
const sourceAccount = app.node.tryGetContext('SourceAccount') as string;

const targetEnv = {
  account: targetAccount,
  region: process.env.CDK_DEFAULT_REGION,
};

const sourceEnv = {
  account: sourceAccount,
  region: process.env.CDK_DEFAULT_REGION,
};

const target = new TargetStack(app, 'TargetStack', {
  env: targetEnv,
  sourceAccountId: sourceAccount,
});

new SourceStack(app, 'SourceStack', {
  env: sourceEnv,
  targetBus: target.bus,
});


app.synth();
