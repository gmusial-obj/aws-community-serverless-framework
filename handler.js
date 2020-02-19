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
