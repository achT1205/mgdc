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
  const { from, to, mgdcId, mgdcName, maleType } = data;
  if (!from || !mgdcId || !to) {
    console.error("Bad request: owner address or mgdc id are required");
    return {
      statusCode: 400,
      body: "Bad request: owner address or mgdc id are required",
    };
  }
  try {
    const hasBreed = await isBreed(from, mgdcId);
    if (hasBreed) {
      console.error("MGDC with %s is already breed", mgdcId);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `MGDC with ${mgdcId} is already breed` }),
      };
    }

    const chatId = await createChat(from, to, mgdcId, mgdcName, maleType);

    const params = {
      TableName: BREED_DB,
      Item: {
        tscreated: tscreated,
        tschanged: tscreated,
        chatId: chatId,
        hasBreed: false,
        owner: from,
        to,
        maleType,
        mgdcId: mgdcId,
        mgdcName: mgdcName,
      },
    };

    console.log("Adding %s items in breed db", JSON.stringify(params));
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

const createChat = async (from, to, mgdcId, mgdcName, maleType) => {
  try {
    const chats = await searchChat(from, to, mgdcId);
    if (chats) {
      // Found some chats
      if (chats.length > 1) {
        console.error(
          `Bad state, More than one chat is found for users ${from} and ${to}`,
          JSON.stringify(chats)
        );
        throw new Error(
          `Bad state, More than one chat is found for users ${from} and ${to}. Please contact adminastrator`
        );
      } else {
        console.log("Chat room already exit with id", chats[0].chatId);
        return chats[0].chatId;
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
        mgdcId: mgdcId,
        mgdcName: mgdcName,
      },
    };

    // Store the chat for user from and to so that it can be retreived from both side
    console.log(`Store chat room for user ${from}`, JSON.stringify(params));
    await clientdb.put(params).promise();
    params.Item.chatSortKey = `member_${to}`;
    params.Item.to = from;
    params.Item.maleType = maleType;
    console.log(`Store chat room for user ${to}`, JSON.stringify(params));
    await clientdb.put(params).promise();
    return chatId;
  } catch (err) {
    console.log("Failed to create chat", err);
    throw err;
  }
};

const searchChat = async (from, to, mgdcId) => {
  const params = {
    TableName: CHATS_DB,
    IndexName: "chat-sort-key-to-index",
    KeyConditionExpression: "#chat = :from and #t = :to",
    FilterExpression: "#m = :mgdcId",
    ExpressionAttributeNames: {
      "#chat": "chatSortKey",
      "#t": "to",
      "#m": "mgdcId",
    },
    ExpressionAttributeValues: {
      ":from": `member_${from}`,
      ":to": to,
      ":mgdcId": mgdcId,
    },
  };
  console.log("Query for searching chat", JSON.stringify(params));
  const result = await clientdb.query(params).promise();
  return result.Items.length > 0 ? result.Items : null;
};
