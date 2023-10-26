import * as cdk from 'aws-cdk-lib';

export interface Subnet {
  name: string;
  cidrMask: number;
  private: boolean;
};

export interface Configs extends cdk.StackProps {
  stack: {
    account: string;
    region: string;
  },
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
  }
  database: {
    name: string;
    allocatedStorage: number;
    publiclyAccessible: boolean;
  }
}

export const configs: Configs = {
  stack: {
    account: '857570805530',
    region: 'us-west-2,'
  },
  vpc: {
    name: 'wtberks-dev-1',
    cidr: '10.0.0.0/16',
    natGateways: 1,
    maxAzs: 2,
    subnets: [
      {
        name: 'wtberks-private-1',
        cidrMask: 24,
        private: true,
      },
      // {
      //   name: 'wtberks-private-2',
      //   cidrMask: 24,
      //   private: true,
      // },
      {
        name: 'wtberks-public-1',
        cidrMask: 24,
        private: false,
      }
    ]
  },
  securityGroup: {
    name: 'wtberks-1-sg',
  },
  dbSecret: {
    name: 'dev/DbPasswordV5',
  },
  database: {
    name: 'LiferayDevDb1',
    allocatedStorage: 20,
    publiclyAccessible: true,
  }
}
