const AWS = require("aws-sdk");

const { BREED_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const { owner } = event.pathParameters;
  const params = {
    TableName: BREED_DB,
    KeyConditionExpression: "#owner = :owner and #mgdcId > :rkey",
    ExpressionAttributeNames: { "#owner": "owner", "#mgdcId": "mgdcId" },
    ExpressionAttributeValues: {
      ":owner": owner,
      ":rkey": 0,
    },
  };

  try {
    const result = await clientdb.query(params).promise();
    return {
      statusCode: 200,
      headers: buildHeaders(),
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error("Failed to load breeds", err);
    return {
      statusCode: 500,
      headers: buildHeaders(),
      body: err,
    };
  }
};

const buildHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };
};
