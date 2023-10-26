import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import path = require('path');
import { Configs, configs } from './configs'
import { Construct } from 'constructs';

export class LiferayStack extends cdk.Stack {

  public readonly lifrayServer: ecsp.ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, id: string, configs: Configs) {
    super(scope, id, configs);

    // Get the secret as it contains information that we will need
    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'Secret', configs.dbSecret.name);
    const vpcId = secret.secretValueFromJson('vpcId').toString();
    const vpcID = vpcId;

    const vpc = ec2.Vpc.fromLookup(this, 'Liferay VPC', {
      vpcId: vpcID,
    });

    // Get the Liferay image
    // const liferayImage = ecs.ContainerImage.fromRegistry(configs.apache.uri);
    const liferayImage = new DockerImageAsset(
      this,
      "liferay",
      {
        directory: path.resolve(__dirname, configs.liferay.dir)
      }
    );

    // const dbCredentials = secretsmanager.Secret.fromSecretNameV2(
    //   this, 'DbCredentials', configs.dbSecret.name
    // );
    const username = secret.secretValueFromJson('username').toString();
    const password = secret.secretValueFromJson('password').toString();
    const dbHost = secret.secretValueFromJson('host').toString();

    // Create ECS service using the provided image
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
              containerPort: 8080,
              containerName: configs.liferay.name,
              enableLogging: true,
              environment: {
                // DB_CLUSTER_PLACEHOLDER: configs.database.dbCluster,
                DB_HOST_PLACEHOLDER: dbHost,
                DB_USERNAME_PLACEHOLDER: username,
                DB_PASSWORD_PLACEHOLDER: password,
                //   PROXY_PASS_HOST: props.proxyPassHost? props.proxyPassHost : '',
              }
            },
        circuitBreaker: {
          rollback: true,
        },
        publicLoadBalancer: true,
      }
    );

    // Create the fargate task definition
    // const taskDefinition = new ecs.FargateTaskDefinition(this, 'ApacheFargateTask');

    // Add a container to the task definition
    // taskDefinition.addContainer('ApacheContainer', {
    //   image: apacheImage,
    //   memoryLimitMiB: 1024,
    //   portMappings: [{containerPort: 80}],
    // });

    //   // Create the fargate service
    //   const apacheService = new ecs.FargateService(this, 'ApacheFargateService', {
    //     cluster: new ecs.Cluster(this, 'ApacheCluster', {
    //       vpc,
    //     }),
    //     taskDefinition,
    //   });
  }
}