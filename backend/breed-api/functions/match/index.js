const AWS = require("aws-sdk");
const { randomUUID } = require("crypto");

const { BREED_DB, CHATS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);

  if (!event.body) {
    console.error("Bad request: body is required");
    return {
      statusCode: 400,
      body: "Bad request: body is required",
    };
  }

  const data = JSON.parse(event.body);
  const tscreated = new Date().getTime();
  const { from, to, mgdcId, mgdcName } = data;
  if (!from || !mgdcId || !to) {
    console.error("Bad request: owner address or mgdc id are required");
    return {
      statusCode: 400,
      body: "Bad request: owner address or mgdc id are required",
    };
  }
  try {
    const chatId = await createChat(from, to);

    const hasBreed = await isBreed(from, mgdcId);
    if (hasBreed) {
      console.error("MGDC with %s is already breed", mgdcId);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `MGDC with ${mgdcId} is already breed` }),
      };
    }

    const params = {
      TableName: BREED_DB,
      Item: {
        tscreated: tscreated,
        tschanged: tscreated,
        chatId: chatId,
        hasBreed: false,
        owner: from,
        mgdcId: mgdcId,
        mgdcName: mgdcName,
      },
    };

    console.log("Adding %s items...", params);
    await clientdb.put(params).promise();
    console.log("Add successfully");
    const rslt = JSON.stringify({ chatId: chatId });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: rslt,
    };
  } catch (err) {
    console.error("Failed to store mgdc", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const isBreed = async (owner, mgdcId) => {
  const params = {
    TableName: BREED_DB,
    Key: { owner: owner, mgdcId: mgdcId },
    AttributesToGet: ["hasBreed"],
  };
  try {
    const result = await clientdb.get(params).promise();
    if (result.Item !== undefined && result.Item !== null) {
      return result.Item.hasBreed;
    }
    return false;
  } catch (err) {
    console.error("Failed to check the breed", err);
    return false;
  }
};

const createChat = async (from, to) => {
  try {
    const chat = await searchChat(from, to);
    if (chat) {
      // Found some chats
      if (chat.length > 1) {
        throw new Error(
          `Bad state, More than one chat is found for users ${from} and ${to}. Please contact adminastrator`
        );
      } else {
        return chat[0].chatId;
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
    return chatId;
  } catch (err) {
    console.log("Failed to create chat", err);
    throw err;
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
