import { DummyProps } from "./dummy"
import { InstanceClass, InstanceSize, MachineImage } from "aws-cdk-lib/aws-ec2"


const dummyPropsDefaults: Pick<DummyProps, "applicationName" | "instanceAMIImage"> = {
  applicationName: "dummy",
  instanceAMIImage: MachineImage.latestAmazonLinux2()
}

export const dummyPropsDev: DummyProps = {
  ...dummyPropsDefaults,
  lambdaMemorySize: 512,
  instanceClass: InstanceClass.T2,
  instanceSize: InstanceSize.SMALL
}

export const dummyPropsProd: DummyProps = {
  ...dummyPropsDefaults,
  lambdaMemorySize: 1024,
  instanceClass: InstanceClass.T2,
  instanceSize: InstanceSize.MEDIUM
}