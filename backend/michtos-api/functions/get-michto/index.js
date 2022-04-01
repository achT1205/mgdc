const AWS = require("aws-sdk");

const { MICHTOS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const { id } = event.pathParameters;
  const params = {
    TableName: MICHTOS_DB,
    Key: { id: id },
  };
  try {
    const result = await clientdb.get(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.Item),
    };
  } catch (err) {
    console.error("Failed to get michto with id %s", id, err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
