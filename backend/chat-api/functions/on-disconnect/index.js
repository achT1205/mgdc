const AWS = require("aws-sdk");

const { CONNECTIONS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const params = {
    TableName: CONNECTIONS_DB,
    Key: {
      connectionId: event.requestContext.connectionId,
    },
  };

  try {
    await clientdb.delete(params).promise();
  } catch (err) {
    console.log("Failed to remove connection id", err);
    return {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Disconnected." };
};
