const AWS = require("aws-sdk");
const { randomUUID } = require("crypto");

const { CHATS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const body = JSON.parse(event.body);

  // TODO Check if chat already exist
  const { from, to } = body;
  const chatId = randomUUID();
  const params = {
    TableName: CHATS_DB,
    Item: {
      chatId: chatId,
      tscreated: new Date().getTime(),
      chatSortKey: `member_${from}`,
    },
  };

  try {
    await clientdb.put(params).promise();
    params.Item.chatSortKey = `member_${to}`;
    await clientdb.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chatId,
      }),
    };
  } catch (err) {
    console.log("Failed to creat chat", err);
    return {
      statusCode: 500,
      body: "Failed to create chat: " + JSON.stringify(err),
    };
  }
};
