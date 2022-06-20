const AWS = require("aws-sdk");

const { BREED_DB, BREED_PREFIX_SOURCE } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();
const ebClient = new AWS.EventBridge();

exports.handler = async (event) => {
  console.log("Event", event);

  if (!event.body) {
    console.error("Bad request: body is required");
    return {
      statusCode: 400,
      body: "Bad request: body is required",
    };
  }
  const { owner } = event.pathParameters;
  const { mgdcId } = JSON.parse(event.body);

  const hasBreed = await isBreed(owner, mgdcId);
  if (hasBreed) {
    console.error("MGDC with %s is already breed", mgdcId);
    return {
      statusCode: 400,
      headers: buildHeaders(),
      body: JSON.stringify({ error: `MGDC with ${mgdcId} is already breed` }),
    };
  }
  const params = {
    TableName: BREED_DB,
    Key: { owner: owner, mgdcId: mgdcId },
    UpdateExpression: "SET #has = :breed, #tschanged = :tschanged",
    ExpressionAttributeNames: { "#has": "hasBreed", "#tschanged": "tschanged" },
    ExpressionAttributeValues: {
      ":breed": true,
      ":tschanged": new Date().getTime(),
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await clientdb.update(params).promise();
    console.log("Result", result);
    await sendBreedEvent(owner, mgdcId);
    console.log("Update successfully");
    return {
      statusCode: 200,
      headers: buildHeaders(),
    };
  } catch (err) {
    console.error("Failed to update breed", err);
    return {
      statusCode: 500,
      headers: buildHeaders(),
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

const sendBreedEvent = async (owner, mgdcId) => {
  try {
    const body = JSON.stringify({ owner, mgdcId });

    const params = {
      Entries: [
        {
          Detail: body,
          DetailType: "MGDC Breed",
          Source: `${BREED_PREFIX_SOURCE}.mdgc.breed`,
        },
      ],
    };
    const result = await ebClient.putEvents(params).promise();
    console.log("Event send successfully - requestID", result);
  } catch (err) {
    console.error("Failed to send breed event", err);
  }
};

const buildHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  };
};
