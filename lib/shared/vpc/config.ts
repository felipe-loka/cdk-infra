import { VPCProps } from "./vpc";

export const vpcPropsDev : VPCProps = {
  cidr: "10.0.0.0/16"
}

export const vpcPropsProd : VPCProps = {
  cidr: "10.10.0.0/16"
}