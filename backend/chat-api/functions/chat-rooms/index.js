const AWS = require("aws-sdk");

const { CHATS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", JSON.stringify(event));
  const { username } = event.pathParameters;
  const params = {
    TableName: CHATS_DB,
    IndexName: "chat-sort-key-index",
    KeyConditionExpression: "chatSortKey = :user",
    ExpressionAttributeValues: {
      ":user": `member_${username}`,
    },
  };
  console.log("Get chat rooms by username query", JSON.stringify(params));
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
    console.error("Failed to load my mgdc chats", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
