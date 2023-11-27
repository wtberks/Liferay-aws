import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Configs, Subnet, configs } from './configs';
import { Scope } from 'aws-cdk-lib/aws-ecs';

export class Ec2Stack extends cdk.Stack {

  constructor(scope: Construct, id: string, configs: Configs) {
    super(scope, id, configs);

    // Get the VPC
    const vpc = ec2.Vpc.fromLookup(this, configs.vpc.name, {
      tags: {
        Name: configs.vpc.name,
      }
    });

    // Get the security group
    const securityGroup = ec2.SecurityGroup.fromLookupByName(
      this,
      id,
      configs.securityGroup.name,
      vpc);

    // Create the EC2 instance
    const ec2Instance = new ec2.Instance(this, configs.ec2Instance.name, {
      vpc,
      vpcSubnets: {
        subnetType: configs.ec2Instance.subnetType,
      },
      securityGroup: securityGroup,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: configs.ec2Instance.keyName,
    });
  }
}