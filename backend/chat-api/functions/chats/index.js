const AWS = require("aws-sdk");

const { CHATS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { chatId } = event.pathParameters;
  const params = {
    TableName: CHATS_DB,
    KeyConditionExpression: "chatId = :id and begins_with(chatSortKey, :rk)",
    ExpressionAttributeValues: {
      ":id": chatId,
      ":rk": "message_",
    },
    Limit: 1000,
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
    console.error("Failed to load chats", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
