import * as cdk from 'aws-cdk-lib';

export interface Configs extends cdk.StackProps {
  env: {
    account: string;
    region: string;
  },
  // vpc: {
  //   name: string;
  //   id: string;
  // },
  securityGroup: {
    name: string;
  },
  // database: {
  //   dbHost: string;
  //   dbCluster: string;
  //   username: string;
  //   password: string;
  // },
  dbSecret: {
    name: string,
  },
  apache: {
    name: string;
    dir: string;
  },
  liferay: {
    name: string;
    dir: string;
  }
}

export const configs: Configs = {
  env: {
    account: '857570805530',
    region: 'us-west-2',
  },
  // vpc: {
  //   name: 'DataStack/wtberks-dev-1',  // Sezarching using the vpcName is not working
  //   id: 'vpc-0c5de25e840205eff',      // Since you have to find a VPC using its ID, make 
  //                                     // sure to update this value to match the current vc
  // },
  securityGroup: {
    name: 'wtberks-1-sg',
  },
  // database: {
  //   dbHost: 'databasestack-liferaydba5625353-wjszcamwmzl7.csjgm0bdzltv.us-west-2.rds.amazonaws.com',
  //   dbCluster: 'datastack-rdsclustera43a99d3-zujkg8ni1tuf',
  //   username: 'DbAdmin',
  //   password: 'PasswordForDbAdmin',
  // },
  dbSecret: {
    name: 'dev/DbPasswordV2',
  },
  apache: {
    name: 'ApacheDev',
    dir: 'apache-docker-image-noproxy',
  },
  liferay: {
    name: 'LiferayDev',
    dir: 'liferay-docker-image',
  }
}
