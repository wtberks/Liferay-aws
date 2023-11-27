import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { Configs, Subnet } from './configs';

export class DatabaseStack extends cdk.Stack {

  constructor(scope: Construct, id: string, configs: Configs) {
    super(scope, id, configs);

    // Get the VPC
    const vpc = ec2.Vpc.fromLookup(this, configs.vpc.name, {
      tags: {
        Name: configs.vpc.name,
      }
    });

    // Creating a secret into which we can place info
    // new secretsmanager.Secret(this, configs.dbSecret.name, {
    //   secretName: configs.dbSecret.name,
    //   secretObjectValue: {
    //     username: cdk.SecretValue.unsafePlainText(configs.dbSecret.username),
    //     password: cdk.SecretValue.unsafePlainText(configs.dbSecret.password),
    //     vpcId: cdk.SecretValue.unsafePlainText(vpc.vpcId),
    //   }
    // })

    // Get the DB credentials
    const dbCredentials = secretsmanager.Secret.fromSecretNameV2(
      this, 'DbCredentials', configs.dbSecret.name
    );

    // Now, create the database
    const dbInstance = new rds.DatabaseInstance(this, 'liferay-db', {
      vpc: vpc,
      // vpcSubnets: {
      //   onePerAz: true,
      //   subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      // },
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_34,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),
      port: 3306,
      credentials: rds.Credentials.fromSecret(dbCredentials),
      multiAz: false,
      allocatedStorage: configs.database.allocatedStorage,
      maxAllocatedStorage: configs.database.allocatedStorage,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: configs.database.name,
      publiclyAccessible: configs.database.publiclyAccessible,
    });

    // const rdsCluster = new rds.DatabaseCluster(this, "rdsCluster", {
    //   engine: rds.DatabaseClusterEngine.auroraMysql({
    //     version: rds.AuroraMysqlEngineVersion.VER_3_04_0,
    //   }),
    //   credentials: rds.Credentials.fromSecret(dbCredentials),
    //   instanceProps: {
    //     vpcSubnets: {
    //       subnetType: ec2.SubnetType.PUBLIC
    //     },
    //     securityGroups: [this.securityGroup],
    //     vpc: this.vpc,
    //   },
    //   defaultDatabaseName: configs.database.name,
    //   instances: 1,
    // });

  }


}
