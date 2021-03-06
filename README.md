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
10. Uncomment resources section in `serverless.yml` and make it look like this
    ```yaml
    resources:
      Resources:
        Tasks:
          Type: AWS::DynamoDB::Table
          Properties:
            AttributeDefinitions:
              - AttributeName: ID
                AttributeType: S
            KeySchema:
              - AttributeName: ID
                KeyType: HASH
            TableName: Tasks
            ProvisionedThroughput:
              ReadCapacityUnits: 1
              WriteCapacityUnits: 1
    ```
    This creates a simple table for tasks
  11. Change `getTasks` method to fetch tasks from the table:
      ```
        'use strict';
        
        const AWS = require('aws-sdk');
        const dynamo = new AWS.DynamoDB();
        
        module.exports.getTasks = async event => {
          const tasks = await dynamo.scan({TableName: 'Tasks'}).promise();
          return {
            statusCode: 200,
            body: JSON.stringify(
              tasks,
              null,
              2
            ),
          };
        };
      ```
      And it explodes with Internal Server error.
  12. Go to CloudWatch and find a surprise:
    ```
    "errorType": "AccessDeniedException",
        "errorMessage": "User: arn:aws:sts::{accountId}:assumed-role/aws-community-serverless-framework-dev-us-east-1-lambdaRole/aws-community-serverless-framework-dev-hello is not authorized to perform: dynamodb:Scan on resource: arn:aws:dynamodb:us-east-1:{accountId}:table/Tasks",
        "code": "AccessDeniedException",
    ```
  13. Let's fix the rights by going to the commented out `iamRoleStatements` section. **EXTREMELY IMPORTANT** the identation needs to match `name` and `runtime` above. `iamRoleStatements` is a property of `provider`.
      ```yaml
      iamRoleStatements:
        - Effect: "Allow"
          Action:
            - "dynamodb:Scan"
          Resource: !GetAtt Tasks.Arn
      ```
14. execute `serverless deploy` and access API again. The response should look like this:
     ```yaml
        {
          "Items": [
            {
              "ID": {
                "S": "1"
              },
              "name": {
                "S": "first"
              }
            }
          ],
          "Count": 1,
          "ScannedCount": 1
        }
     ```
 12. Let's add some APi security now. We will click through and Create Amazon Cognito User pool with App Client and Hosted UI pointing to localhost. We will create a user and log in using credentials.
 We will then capture authorization code and exchange it to token using `/oauth2/token` endpoint.
 13. Once cognito is created we extend our endpoint listener to contain Cognito authorizer
    ```
        authorizer:
            name: aaa-auth
            arn: arn:aws:cognito-idp:us-east-1:{accountId}:userpool/us-east-1_jNfHNFfCM
    ```
   14. Execute `serverless deploy` and enjoy secure API