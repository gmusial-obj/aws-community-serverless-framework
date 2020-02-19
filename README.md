# aws-community-serverless-framework

Steps:
1. Install NodeJS LTS
2. Make sure you have access to AWS Console and your `~/.aws/credentials` are working properly and you have semi-admin premissions to create S3 buckets, Lambdas etc. etc.
3. For a simple AWS test just execute `aws s3 ls`
4. Install serverless framweork globally using `npm install -g serverless`
5. Run `serverless create --template aws-nodejs` with a proper template https://serverless.com/framework/docs/providers/aws/cli-reference/create#available-templates
6. `create` command followed by `serverless deploy` sets up working lambda doing hello world with no external trigger. There should be three basic resources available in S3, CloudFormation and Lambda. By default in us-east-1 region
7. `serverless.yml` is the backbone of the whole solution holding full configuration
8. Go to `serverless.yml` and uncomment the following code
    ```yaml
        events:
          - http:
              path: tasks
              method: get
    
    ```
   And change the handler to have `getTasks` and adjust `serverless.yml` accordingly
9. Execute `serverless deploy` and observe carefully the console output. There should be the API endpoint URL available and even publicly available and working. Something like `GET - https://{some-id}.execute-api.us-east-1.amazonaws.com/dev/users`
