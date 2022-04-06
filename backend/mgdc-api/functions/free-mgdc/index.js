const AWS = require("aws-sdk");

const { MGDC_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  const params = {
    TableName: MGDC_DB,
    IndexName: "free-mgdc-index",
    KeyConditionExpression: "hasBreed = :breed",
    ExpressionAttributeValues: {
      ":breed": "false",
    },
  };

  try {
    const result = await clientdb.query(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error("Failed to load free mgdc", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
