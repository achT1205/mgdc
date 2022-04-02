const AWS = require("aws-sdk");

const { CONNECTIONS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const { connectionId } = event.requestContext;
  const body = JSON.parse(event.body);
  const params = {
    TableName: CONNECTIONS_DB,
    Key: {
      connectionId: connectionId,
    },
    UpdateExpression: "set username = :a, userStatus=:s, tsconnected=:t",
    ExpressionAttributeValues: {
      ":a": body.address,
      ":s": "online",
      ":t": new Date().getTime(),
    },
    ReturnValues: "UPDATED_NEW",
  };
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  try {
    const result = await clientdb.update(params).promise();
    console.log("Result", result);
    await sendNotification(
      apigwManagementApi,
      connectionId,
      `${body.address} are now online`
    );
  } catch (err) {
    console.log("Failed to set user online", err);
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 202 };
};

const sendNotification = async (client, id, message) => {
  try {
    await client
      .postToConnection({
        ConnectionId: id,
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
