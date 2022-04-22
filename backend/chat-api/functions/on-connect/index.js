const AWS = require("aws-sdk");

const { CONNECTIONS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const params = {
    TableName: CONNECTIONS_DB,
    Item: {
      connectionId: event.requestContext.connectionId,
    },
  };

  try {
    await clientdb.put(params).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Connected." };
};
