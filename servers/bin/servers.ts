#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { configs } from '../lib/configs';
// import { ApacheStack } from '../lib/apache-stack';
// import { LiferayStack } from '../lib/liferay-stack';
import { ServersStack } from '../lib/servers-stack';

const app = new cdk.App();
// new ApacheStack(app, 'ApacheStack1', configs);
// new LiferayStack(app, 'LiferayStack2', configs);
new ServersStack(app, 'ServersStack1', configs);