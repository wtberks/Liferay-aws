import * as cdk from 'aws-cdk-lib';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import path = require('path');
import { Configs, configs } from './configs'
import { Construct } from 'constructs';

export class ServersStack extends cdk.Stack {

  public readonly apacheServer: ecsp.ApplicationLoadBalancedFargateService;
  public readonly lifrayServer: ecsp.ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, id: string, configs: Configs) {
    super(scope, id, configs);

    const namespace = new cloudmap.CfnPrivateDnsNamespace(this, 'namespace', {
      name: 'local',
      vpc: configs.vpc.id,
    });

    const vpc = ec2.Vpc.fromLookup(this, 'Liferay VPC', {
      vpcId: configs.vpc.id,
    });

    // Get the apache image
    // const apacheImage = ecs.ContainerImage.fromRegistry(configs.apache.uri);
    const apacheImage = new DockerImageAsset(
      this,
      configs.apache.name,
      {
        assetName: configs.apache.name,
        directory: path.resolve(__dirname, configs.apache.dir),
      }
    );

    // Get the Liferay image
    // const liferayImage = ecs.ContainerImage.fromRegistry(configs.liferay.uri);
    const liferayImage = new DockerImageAsset(
      this,
      configs.liferay.name,
      {
        directory: path.resolve(__dirname, configs.liferay.dir)
      }
    );

    const dbCredentials = secretsmanager.Secret.fromSecretNameV2(
      this, 'DbCredentials', configs.dbSecret.name
    );
    const username = dbCredentials.secretValueFromJson(configs.dbSecret.dbUsername).unsafeUnwrap();
    const password = dbCredentials.secretValueFromJson(configs.dbSecret.dbPassword).unsafeUnwrap();
    const dbHost = dbCredentials.secretValueFromJson(configs.dbSecret.dbHost).unsafeUnwrap();
    const dbName = configs.database.name;

    // Create Liferay service using the provided image
    this.lifrayServer = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      id,
      {
        vpc: vpc,
        cpu: 4096,
        memoryLimitMiB: 8192,
        desiredCount: 1,
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(liferayImage),
          // image: liferayImage,
          containerPort: 8080,
          containerName: configs.liferay.name,
          enableLogging: true,
          environment: {
            // DB_CLUSTER: configs.database.dbCluster,
            DB_HOST: dbHost,
            DB_USERNAME: username,
            DB_PASSWORD: password,
            DB_NAME: dbName,
          }
        },
        circuitBreaker: {
          rollback: true,
        },
        publicLoadBalancer: false,
      }
    );

    // Create Apache service using the provided image
    this.apacheServer = new ecsp.ApplicationLoadBalancedFargateService(
      this,
      id,
      {
        vpc: vpc,
        cpu: 256,
        desiredCount: 1,
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(apacheImage),
          // image: apacheImage,
          containerPort: 80,
          containerName: configs.apache.name,
          enableLogging: true,
          environment: {
            PROXY_PASS_HOST: this.lifrayServer.loadBalancer.loadBalancerDnsName,
          }
        },
        circuitBreaker: {
          rollback: true,
        },
        publicLoadBalancer: true,
      }
    );

 }
}