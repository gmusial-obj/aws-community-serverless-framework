# aws-community-serverless-framework

Steps:
1. Install NodeJS LTS
2. Make sure you have access to AWS Console and your `~/.aws/credentials` are working properly and you have semi-admin premissions to create S3 buckets, Lambdas etc. etc.
3. For a simple AWS test just execute `aws s3 ls`
4. Install serverless framweork globally using `npm install -g serverless`
5. Run `serverless create --template aws-nodejs` with a proper template https://serverless.com/framework/docs/providers/aws/cli-reference/create#available-templates
