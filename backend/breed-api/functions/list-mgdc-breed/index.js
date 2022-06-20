const AWS = require("aws-sdk");

const { BREED_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const { to } = event.pathParameters;
  const params = {
    TableName: BREED_DB,
    IndexName: "to-mgdcId-index",
    KeyConditionExpression: "#to = :to and #mgdcId > :rkey",
    ExpressionAttributeNames: { "#to": "to", "#mgdcId": "mgdcId" },
    ExpressionAttributeValues: {
      ":to": to,
      ":rkey": 0,
    },
  };
  console.log("Get list of MGDC breed query", JSON.stringify(params));
  try {
    const result = await clientdb.query(params).promise();
    return {
      statusCode: 200,
      headers: buildHeaders(),
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error("Failed to load MGDC breed", err);
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
