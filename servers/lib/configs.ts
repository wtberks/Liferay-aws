import * as cdk from 'aws-cdk-lib';

export interface Configs extends cdk.StackProps {
  env: {
    account: string;
    region: string;
  },
  vpc: {
    name: string;
    id: string;
  },
  securityGroup: {
    name: string;
  },
  database: {
    name: string;
  },
  dbSecret: {
    name: string,
    dbHost: string;
    dbUsername: string;
    dbPassword: string;
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
  vpc: {
    name: 'wtberks-dev-1',  // Sezarching using the vpcName is not working
    id: 'vpc-0cad3ed27615b6c71',      // Since you have to find a VPC using its ID, make 
                                      // sure to update this value to match the current vc
  },
  securityGroup: {
    name: 'wtberks-1-sg',
  },
  database: {
    name: 'LiferayDevDb1',
  },
  dbSecret: {
    name: 'dev/DbPasswordV5',
    dbHost: 'host',
    dbUsername: 'username',
    dbPassword: 'password',
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
