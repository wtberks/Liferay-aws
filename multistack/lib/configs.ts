import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface Subnet {
  name: string;
  cidrMask: number;
  subnetType: ec2.SubnetType;
  mapPublicIpOnLanch: boolean;
};

export interface Configs extends cdk.StackProps {
  vpc: {
    name: string;
    cidr: string;
    natGateways: number;
    maxAzs: number;
    subnets: Subnet[],
    natGatewatSubnetName: string,
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
    subnetType: ec2.SubnetType;
    publiclyAccessible: boolean;
  },
  ec2Instance: {
    name: string;
    subnetType: ec2.SubnetType;
    keyName: string;
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
    name: 'wtberks-dev-27',
    cidr: '10.0.0.0/16',
    natGateways: 1,
    maxAzs: 2,
    subnets: [
      {
        name: 'wtberks-private-1',
        cidrMask: 28,
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        mapPublicIpOnLanch: false,
      },
      {
        name: 'wtberks-private-2',
        cidrMask: 28,
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        mapPublicIpOnLanch: false,
      },
      {
        name: 'wtberks-public-1',
        cidrMask: 24,
        subnetType: ec2.SubnetType.PUBLIC,
        mapPublicIpOnLanch: true,
      },
    ],
    natGatewatSubnetName: 'wtberks-public-1',
  },
  securityGroup: {
    name: 'wtberks-4-sg',
  },
  dbSecret: {
    name: 'dev/DbPasswordV6',
    dbHost: 'host',
    dbUsername: 'username',
    dbPassword: 'password',
  },
  database: {
    name: 'LiferayDevDb1',
    allocatedStorage: 20,
    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    publiclyAccessible: false,
  },
  ec2Instance: {
    name: 'ec2-instance',
    subnetType: ec2.SubnetType.PUBLIC,
    keyName: 'ec2-key-pair',
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
