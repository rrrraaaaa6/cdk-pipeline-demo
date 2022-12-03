import { App, Stack, StackProps, Stage } from "aws-cdk-lib"
import { LinuxBuildImage } from "aws-cdk-lib/aws-codebuild";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";


export interface PipelineStackProps extends StackProps{
    readonly devStage: Stage,
    // readonly testStage: Stage
    // readonly prodStage: Stage
    // readonly prodUseast1Stage: Stage
}

export class PipelineStack extends Stack{
    constructor(scope: App, id: string, props: PipelineStackProps){
        super(scope, id, props)

        const pipelineName = 'demo-pipeline'
        const releaseBranchName = 'main' 

        const soureceRepository = new Repository(this, 'repository', {
            repositoryName: pipelineName
        })

        const synth = new ShellStep('synth', {
            input: CodePipelineSource.codeCommit(soureceRepository, releaseBranchName),
            commands: [
                "cdk synth" 
                // inputにcdk.outが含まれない場合は適宜cdk synthとか実行しておけばOK
                // ローカルでcdk synth実行して、zipにしてS3にアップロードする場合とかは空でOK
            ]
        })

        const pipeline = new CodePipeline(this, 'pipeline', {
            synth: synth,
            crossAccountKeys: true,     // クロスアカウントでデプロイする時はtrueに
            selfMutation: true,          // selfMutationうざっといな〜ってきとはfalseに
            pipelineName: pipelineName,
            codeBuildDefaults: {
                buildEnvironment: {
                    // All projects run non-privileged build, SMALL instance, LinuxBuildImage.STANDARD_5_0
                    //デフォルトは5.0。python3.10とかで書いてる人は6.0に
                    buildImage: LinuxBuildImage.STANDARD_5_0 
                }
            }
        })

        pipeline.addStage(props.devStage)

        // const integTestStep = new CodeBuildStep('integTest', {
        //     commands: [
        //         'echo hello cdk!'
        //     ]
        // })

        //
        // const stage = props.testStage
        // pipeline.addStage(stage, {
        //     post: [
        //         integTestStep
        //     ],
        //     stackSteps: [
        //         {
        //             stack: stage.node.findChild('sampleStack') as Stack,
        //             post: [
        //                 new ShellStep('integTestStepPostSampleStack', {
        //                     commands: ['echo hello']
        //                 })
        //             ]
        //         }
        //     ]
        // })

        // // prodはap-northeast-1とus-east-1に両方展開します。
        // const prodWave = pipeline.addWave('prod', {
        //     pre: [
        //         new ManualApprovalStep('Approve')
        //     ]
        // })

        // prodWave.addStage(props.prodStage)
        // prodWave.addStage(props.prodUseast1Stage)
    
        pipeline.buildPipeline()
    }
}