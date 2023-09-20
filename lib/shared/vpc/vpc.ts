import * as cdk from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { StackProps } from '../../mainStack'

export interface VPCProps {
  cidr: string
}

export class VPCStack extends cdk.Stack {
  vpc: ec2.Vpc

  constructor (scope: Construct, id: string, props: StackProps) {
    super(scope, id)


    this.vpc = new ec2.Vpc(this, 'vpc', {
      ipAddresses: ec2.IpAddresses.cidr(props.vpcProps.cidr)
    })

  }
}
