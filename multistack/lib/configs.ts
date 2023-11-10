import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface Subnet {
  name: string;
  cidrMask: number;
  subnetType: ec2.SubnetType;
};

export interface Configs extends cdk.StackProps {
  vpc: {
    name: string;
    cidr: string;
    natGateways: number;
    maxAzs: number;
    subnets: Subnet[],
  },
  securityGroup: {
    name: string;
  },
  dbSecret: {
    name: string,
    dbHost: string;
    dbUsername: string;
    dbPassword: string;
  }
  database: {
    name: string;
    allocatedStorage: number;
    publiclyAccessible: boolean;
  },
  apache: {
    name: string;
    dir: string;
    // uri: string;
  },
  liferay: {
    name: string;
    dir: string;
    // uri: string;
  },
}

export const configs: Configs = {
  env: {
    account: '857570805530',
    region: 'us-west-2',
  },
  vpc: {
    name: 'wtberks-dev-2',
    cidr: '10.0.0.0/16',
    natGateways: 1,
    maxAzs: 2,
    subnets: [
      {
        name: 'wtberks-private-1',
        cidrMask: 24,
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      {
        name: 'wtberks-private-2',
        cidrMask: 24,
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      {
        name: 'wtberks-public-1',
        cidrMask: 24,
        subnetType: ec2.SubnetType.PUBLIC,
      }
    ]
  },
  securityGroup: {
    name: 'wtberks-1-sg',
  },
  dbSecret: {
    name: 'dev/DbPasswordV5',
    dbHost: 'host',
    dbUsername: 'username',
    dbPassword: 'password',
  },
  database: {
    name: 'LiferayDevDb1',
    allocatedStorage: 20,
    publiclyAccessible: true,
  },
  apache: {
    name: 'ApacheDev',
    dir: 'apache-docker-image-proxy',
  },
  liferay: {
    name: 'LiferayDev',
    dir: 'liferay-docker-image',
  },
}
