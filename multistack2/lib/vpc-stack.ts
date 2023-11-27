import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { Configs, Subnet } from './configs';
import { config } from 'process';

export class VpcStack extends cdk.Stack {

  constructor(scope: Construct, id: string, configs: Configs) {
    super(scope, id, configs);

    // Create the VPC
    const vpc = new ec2.Vpc(this, configs.vpc.name, {
      cidr: configs.vpc.cidr,
      natGateways: configs.vpc.natGateways,
      vpcName: configs.vpc.name,
      maxAzs: configs.vpc.maxAzs,
      // subnetConfiguration: this.getSubnets(configs.vpc.subnets),
    });

    // Tag the vpc to make it easier to find
    // cdk.Aspects.of(vpc).add(new cdk.Tag('app', configs.vpc.tag));

    // Next, create a security group
    const securityGroup = new ec2.SecurityGroup(this, configs.securityGroup.name, {
      vpc: vpc,
      securityGroupName: configs.securityGroup.name,
      description: 'Security group for ' + configs.vpc.name,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH access from anywhere',
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP access from anywhere',
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS access from anywhere',
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      'Allow MySQL access from anywhere',
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(2049),
      'Allow NFS access from anywhere',
    )

  }

  getSubnets(subnets: Subnet[]): ec2.SubnetConfiguration[] {
    const results: ec2.SubnetConfiguration[] = [];
    if (!subnets) return results;
    for (let i = 0; i < subnets.length; i++) {
      results.push(this.getSubnet(subnets[i]));
    }
    return results;
  }

  getSubnet(subnet: Subnet): ec2.SubnetConfiguration {
    return {
      name: subnet.name,
      cidrMask: subnet.cidrMask,
      subnetType: subnet.subnetType,
    };
  }
}