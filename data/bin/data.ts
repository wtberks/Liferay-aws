#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { configs } from '../lib/configs';
import { DatabaseStack } from '../lib/database-stack';

const app = new cdk.App();
new DatabaseStack(app, 'DatabaseStack1026', configs);
