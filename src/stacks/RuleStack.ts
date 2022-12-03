import { Stack, StackProps } from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";



export class SampleStack extends Stack{
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        new Vpc(this, 'test', {
        })
    }
}