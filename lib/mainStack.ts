import * as cdk from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import * as pipelines from 'aws-cdk-lib/pipelines'

import { VPCStack, VPCProps } from './shared/vpc/vpc'
import * as vpcProps from './shared/vpc/config'

import { DummyProps, DummyStack } from './apps/dummy/dummy'
import * as dummyProps from './apps/dummy/config'

import * as config from './configs'

export interface StackProps {
  accountProps: config.AccountProps;
  vpcProps: VPCProps;
  dummyProps: DummyProps;
}

export class MainStack extends cdk.Stack {
  pipeline: pipelines.CodePipeline

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const githubRepositoy = "felipe-loka/cdk-infra"
    const githubPipelineBranch = "main"
    const githubCodestartConnectionARN = "arn:aws:codestar-connections:us-east-2:937168356724:connection/04d8546b-c5cc-46be-848a-a0b1259484db"

    const githubConnection = pipelines.CodePipelineSource.connection(
      githubRepositoy,
      githubPipelineBranch,
      { connectionArn: githubCodestartConnectionARN }
    );

    this.pipeline = new pipelines.CodePipeline(this, "pipeline", {
      synth: new pipelines.ShellStep(
        "Synth",
        {
          input: githubConnection,
          commands: [
            "npm install",
            "npx cdk synth"
          ]
        }
      )
    });

    const stackPropsDev: StackProps = {
      accountProps: config.accountPropsDev,
      vpcProps: vpcProps.vpcPropsDev,
      dummyProps: dummyProps.dummyPropsDev,
    };

    // const stackPropsProd: StackProps = {
    //   accountProps: config.accountPropsProd,
    //   vpcProps: vpcProps.vpcPropsProd,
    //   dummyProps: dummyProps.dummyPropsProd,
    // }


    this.deployToEnvironment(config.environment.DevUsEast1, stackPropsDev)
    this.deployToEnvironment(config.environment.DevUsWest1, stackPropsDev)

    // this.deployToEnvironment(config.environment.ProdUsEast1, stackPropsProd)
    // this.deployToEnvironment(config.environment.ProdUsWest1, stackPropsProd)


  }

  deployToEnvironment(environment: cdk.Environment, stackProps: StackProps) : void {
    const stage = new EnvironmentStage(
      this,
      `${stackProps.accountProps.environmentName}-stage-${environment.region}`,
      {env: environment},
      stackProps
    );

    this.pipeline.addStage(stage);
  }
}

class EnvironmentStage extends cdk.Stage {
  constructor(
    scope: Construct,
    id: string,
    props: cdk.StageProps,
    stackProps: StackProps,
  ) {
    super(scope, id, props);

    const vpc = new VPCStack(this, "VPC", stackProps)
    new DummyStack(this, "DummyStack", stackProps, vpc)
  }
}
