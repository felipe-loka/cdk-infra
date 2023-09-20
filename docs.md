# CDK

## Bootstrap
In order to really use CDK (deploy stuff), you will need to bootstrap your account. This is a manual step that involves the creation of some necessary infrastructure in order to use CDK. Before starts using it, you will need to bootstrap your account, it's easy and straightforward.

## Fast start
You can use CDK CLI to quickly setup a standard template: `cdk init app --language typescript`. It creates some folders and files that's worth mentioning in order to fully understand how CDK works:

- **lib**: This is where we define our stack.
- **bin**: Entrypoint of CDK. We will load the stack here.
- **test**: Tests for our infrastructure.
- **cdk.json**: Tells CDK how (what command) to run the project.

Some other files will appear but they are common in the javascript environment: package.json (dependencies management), tsconfig.json (typescript configuration), npmignore (ommit files to push to npm).

It's really important to understand that this folder structure is not a must have. This is the basic folder structure provided as a template by the CDK CLI, this can be changed as you wish. The important thing here is to comprehend that the `cdk.json` will execute the entrypoint command of the application.

## CDK commands
CDK CLI is very helpful and you can you to perform actions to deploy/destroy/check your infrastructure.

- **cdk synth**: Synthetize a given stack to a CloudFormation template.
- **cdk diff**: Compares a given stack with the stack deployed.
- **cdk deploy**: Deploy the stack in AWS.
- **cdk destroy**: Destroy a given stack.
- **cdk ls**: List all the stacks.


## Concepts
The idea of the CDK is to create an application (App) that contains stack(s) and each stack contains constructors. The CDK uses CloudFormation behind the scenes, so several words used here (such as stack) comes from CloudFormation.

### Apps
We can consider the app as the entrypoint or heart of the CDK. The app provides a context for things to be instanciated. 

``` typescript
const app = new cdk.App();
```

The `app` will be needed when creating the stack(s).

### Constructor
Constructors are the base building block of CDK and they are instanciated inside the stacks. You use constructs to organize the individual AWS resources that you want to deploy. 

Constructor expects three main arguments when initializing it: 
- **scope**: The construct's parent or owner, either a stack or another construct, which determines its place in the construct tree. You should usually pass `this`, which represents the current object, for the scope.
- **id**: It's the identifier of the construct. If you change this, CloudFormation will force a recreation of the constructor. 
- **props**: A set of properties that defines the configuration of the constructor (e.g. in a L2 S3 constructor you can set to True a flag to control if the bucket will be versioned)

There are three levels of constructors: the higher the level, higher the abstraction is.

- **L1 (Cfn)**: Lowest level of abstrction of the resource creation of the resources in AWS. This is a 1:1 relationship with CloudFormation resources. All L1 constructors starts with `Cfn` (e.g. CfnBucket). When using L1 resources, you should explicitly configure ALL properties, so basically, there is no default values for properties. Usually you will avoid L1 resources when L2 resources exist.

```typescript
import * as cdk from 'aws-cdk-lib';

class HelloCdkStack extends Stack {
  constructor(scope: App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.CfnBucket(this, "MyBucket", {
        bucketName: "MyBucket"
    });
  }
}
```

- **L2**: It's basically a L1 resources with default values, boilerplate code and logic written for you. You will be using L2 constructors most of the time. Besides default values, you can also use some methods (such as granting permissions, lifecycle management...). 

```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

class HelloCdkStack extends Stack {
  constructor(scope: App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'MyFirstBucket', {
    versioned: true
    });
  }
}
```

- **L3 (patterns)**: Highest level of abstraction. L3 constructors implements common AWS patterns, such as API Gateway with Lambda integration. So basically it creates several resources used in common usecases.

It's common for you to create your own constructors using other constructors. So, for example, you can create an S3 constructor that implements standards/best practices that you want to have accross applications.

```typescript
export interface NotifyingBucketProps {
  prefix?: string;
}

export class NotifyingBucket extends Construct {
  constructor(scope: Construct, id: string, props: NotifyingBucketProps = {}) {
    super(scope, id);
    const bucket = new s3.Bucket(this, 'bucket');
    const topic = new sns.Topic(this, 'topic');
    bucket.addObjectCreatedNotification(new s3notify.SnsDestination(topic),
      { prefix: props.prefix });
  }
}
```

#### Handling permissions
It's not expected to handle IAM Policies and Roles directly when using CDK. Actually, L2 constructors allow you to use grant methods in order to grant the required permissions. 


```typescript
class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rawData = new s3.Bucket(this, 'raw-data');
    const dataScience = new iam.Group(this, 'data-science');
    rawData.grantRead(dataScience);
  }
}
```

## Stacks
Stacks are the unit of deployment in CDK.



## Best practices
- Although there is a relation between CDK and CloudFormation, you should avoid the usage of CloudFormation Parameters.