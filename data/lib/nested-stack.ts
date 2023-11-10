import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configs } from './configs';

export class NestedStack extends cdk.Stack {

  constructor(scope: Construct, id: string, configs: Configs) {
    super(scope, id, configs);
  }
}