#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { configs } from '../lib/configs';
import { VpcStack } from '../lib/vpc-stack';
import { Ec2Stack } from '../lib/ec2-stack';
import { DatabaseStack } from '../lib/database-stack';
import { ServersStack } from '../lib/servers-stack';

const app = new cdk.App();
new VpcStack(app, 'VpcStack', configs);
new Ec2Stack(app, 'Ec2Stack', configs);
new DatabaseStack(app, 'DatabaseStack', configs);
new ServersStack(app, 'ServersStack', configs);
