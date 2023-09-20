import * as cdk from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { StackProps } from '../../mainStack'
import { VPCStack } from '../../shared/vpc/vpc'

export interface DummyProps {
  applicationName: string;
  lambdaMemorySize: number;
  environmentVariables?: { string: string }[];
  instanceClass: ec2.InstanceClass;
  instanceSize: ec2.InstanceSize;
  instanceAMIImage: ec2.IMachineImage
}

export class DummyStack extends cdk.Stack {
  name : string
  dummy : DummyProps

  constructor (scope: Construct, id: string, props: StackProps, vpc: VPCStack) {
    super(scope, id)

    this.dummy = props.dummyProps
    this.name = `${props.accountProps.environmentName}-${this.dummy.applicationName}`


    const bucket = new Bucket(this, `${this.name}-bucket`);

    const instance = new ec2.Instance(this,`${this.name}-ec2`,{
      instanceType: ec2.InstanceType.of(this.dummy.instanceClass, this.dummy.instanceSize),
      machineImage: this.dummy.instanceAMIImage,
      vpc: vpc.vpc,
    });

    bucket.grantReadWrite(instance)
  }
}
