import { App,  CliCredentialsStackSynthesizer,  Stack,  StackProps,  Stage } from 'aws-cdk-lib';
import { CfnOrganizationConformancePack, ManagedRule } from 'aws-cdk-lib/aws-config';
import { Construct } from 'constructs';

export class RuleStack extends Stack{
  constructor(scope: Construct, id: string, props?: StackProps){
      super(scope, id, props)

      new ManagedRule(this, 'rule', {
        identifier: 'ACCESS_KEYS_ROTATED'
      })

  }
}

export interface ConformanceStackProps extends StackProps{
  templateBody: string
}
export class ConformanceStack extends Stack{
  constructor(scope: Construct, id: string, props: ConformanceStackProps){
    super(scope, id, props)
    
    new CfnOrganizationConformancePack(this, "conformancePack", {
      templateBody: props.templateBody,
      organizationConformancePackName: 'conformancePack-demo'
    })

  }
}

const app = new App();

// Template用のStage
const templateStage = new Stage(app, 'template')
const stack = new RuleStack(templateStage, 'RuleTemplate', {
  analyticsReporting: false,
  synthesizer: new CliCredentialsStackSynthesizer()
})
const artifactId = stack.artifactId


const templateBody = JSON.stringify(templateStage.synth().getStackArtifact(artifactId).template)
new ConformanceStack(app, 'ConformanceStack', {
  templateBody: templateBody
})

app.synth();