import { Environment } from "aws-cdk-lib"

export enum Account {
  Dev = "937168356724",
  Prod = "222222222222"
}

export enum Region {
  UsWest1 = "us-west-1",
  UsEast1 = "us-east-1",
}

export const environment : {[key: string]: Environment} = {
  DevUsWest1: {
      account: Account.Dev,
      region: Region.UsWest1
  },
  DevUsEast1: {
    account: Account.Dev,
    region: Region.UsEast1
  },
  ProdUsWest1: {
    account: Account.Prod,
    region: Region.UsWest1
  },
  ProdUsEast1: {
    account: Account.Prod,
    region: Region.UsEast1
  }
}

export interface AccountProps {
  accountNumber: Account;
  environmentName: "dev" | "prod"
}

export const accountPropsDev : AccountProps = {
  accountNumber: Account.Dev,
  environmentName: "dev"
}

export const accountPropsProd : AccountProps = {
  accountNumber: Account.Prod,
  environmentName: "prod"
}
