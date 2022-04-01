const AWS = require("aws-sdk");
const { randomBytes } = require("crypto");

const { CONNECTIONS_DB, CHATS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);

  const { connectionId, requestTime } = event.requestContext;

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  const body = JSON.parse(event.body);
  const { chatId, from, to, message } = body;
  try {
    await sendPrivate(apigwManagementApi, connectionId, message, to);
    await storeMessage(chatId, from, to, message, requestTime);
  } catch (e) {
    console.error("Failed to send message", e);
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};

const sendPrivate = async (client, id, message, to) => {
  try {
    const receiverConnection = await findReceiverConnectionId(to);
    if (!receiverConnection) {
      throw new Error(`User ${to} is not connected`);
    }
    await client
      .postToConnection({
        ConnectionId: receiverConnection.connectionId,
        Data: Buffer.from(JSON.stringify(message)),
      })
      .promise();
  } catch (e) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${id}`);
      await clientdb
        .delete({ TableName: CONNECTIONS_DB, Key: { id } })
        .promise();
    } else {
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

const storeMessage = async (chatId, from, to, message, requestTime) => {
  console.log("Reqest time", Date.parse(requestTime));
  const tscreated = new Date().getTime();
  const params = {
    TableName: CHATS_DB,
    Item: {
      chatId: chatId,
      chatSortKey: `message_${tscreated}_${randomBytes(8).toString("hex")}`,
      tscreated: tscreated,
      message: message,
      author: from,
      to: to,
    },
  };

  return clientdb.put(params).promise();
};
