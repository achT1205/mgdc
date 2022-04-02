const AWS = require("aws-sdk");
const { randomUUID } = require("crypto");

const { CHATS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const body = JSON.parse(event.body);

  const { from, to } = body;

  try {
    const chat = await searchChat(from, to);
    if (chat) {
      // Found some chats
      if (chat.length > 1) {
        return {
          statusCode: 400,
          body: `Bad state, More than one chat is found for users ${from} and ${to}. Please contact adminastrator`,
        };
      } else {
        console.log(chat);
        return buildSuccessResponse(
          JSON.stringify({
            chatId: chat[0].chatId,
          })
        );
      }
    }
    // Chat does not exist
    const chatId = randomUUID();
    const tscreated = new Date().getTime();
    const params = {
      TableName: CHATS_DB,
      Item: {
        chatId: chatId,
        tscreated: tscreated,
        chatSortKey: `member_${from}`,
        to: to,
      },
    };

    // Store the chat for user from and to so that it can be retreived from both side
    await clientdb.put(params).promise();
    params.Item.chatSortKey = `member_${to}`;
    params.Item.to = from;
    await clientdb.put(params).promise();
    return buildSuccessResponse(
      JSON.stringify({
        chatId: chatId,
      })
    );
  } catch (err) {
    console.log("Failed to create chat", err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

const searchChat = async (from, to) => {
  const params = {
    TableName: CHATS_DB,
    IndexName: "chat-sort-key-to-index",
    KeyConditionExpression: "#chat = :from and #t = :to",
    ExpressionAttributeNames: {
      "#chat": "chatSortKey",
      "#t": "to",
    },
    ExpressionAttributeValues: {
      ":from": `member_${from}`,
      ":to": to,
    },
    Limit: 1,
  };
  const result = await clientdb.query(params).promise();
  return result.Items.length > 0 ? result.Items : null;
};

const buildSuccessResponse = (body) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body,
  };
};
