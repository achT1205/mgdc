const AWS = require("aws-sdk");
const { randomBytes } = require("crypto");

const { CONNECTIONS_DB, CHATS_DB, CHAT_EXPIRATION_IN_MONTH } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", JSON.stringify(event));

  const { domainName, stage } = event.requestContext;

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`,
  });

  const body = JSON.parse(event.body);
  const { chatId, from, to, message } = body;
  try {
    const status = await sendPrivate(apigwManagementApi, message, to);
    await storeMessage(chatId, from, to, message, status);
  } catch (e) {
    console.error("Failed to send message", e);
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};

const sendPrivate = async (client, message, to) => {
  let connectionId;
  try {
    const receiverConnection = await findReceiverConnectionId(to);
    if (!receiverConnection) {
      console.log("User %s is not connected");
      return false;
    }
    connectionId = receiverConnection.connectionId;
    await client
      .postToConnection({
        ConnectionId: connectionId,
        Data: Buffer.from(JSON.stringify(message)),
      })
      .promise();
    return true;
  } catch (e) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${connectionId}`);
      await clientdb
        .delete({ TableName: CONNECTIONS_DB, Key: { connectionId } })
        .promise();
      return false;
    } else {
      // Something bad happen, we don't know what is it
      throw e;
    }
  }
};

const findReceiverConnectionId = async (to) => {
  const params = {
    TableName: CONNECTIONS_DB,
    IndexName: "username-index",
    KeyConditionExpression: "username = :adrs",
    ExpressionAttributeValues: {
      ":adrs": to,
    },
    Limit: 1,
  };
  const result = await clientdb.query(params).promise();
  console.log("Receicer connection info", result.Items);
  return result.Items.length > 0 ? result.Items[0] : null;
};

const storeMessage = async (chatId, from, to, message, status) => {
  const tscreated = new Date().getTime();
  const expiration = new Date();
  expiration.setMonth(
    expiration.getMonth() + parseInt(CHAT_EXPIRATION_IN_MONTH)
  );
  const params = {
    TableName: CHATS_DB,
    Item: {
      chatId: chatId,
      chatSortKey: `message_${tscreated}_${randomBytes(8).toString("hex")}`,
      tscreated: tscreated,
      expdate: expiration,
      message: message,
      author: from,
      to,
      read: status,
    },
  };

  return clientdb.put(params).promise();
};
