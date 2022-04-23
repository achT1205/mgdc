const AWS = require("aws-sdk");

const { BREED_DB, BREED_MGDC_QUEUE_URL } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

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
  };

  try {
    await clientdb.update(params).promise();
    await sendBreedEvent(mgdcId);
    console.log("Update successfully");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.error("Failed to update breed", err);
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

const sendBreedEvent = async (mgdcId) => {
  try {
    const body = JSON.stringify({ mgdcId });
    const params = {
      MessageBody: body,
      QueueUrl: BREED_MGDC_QUEUE_URL,
    };
    await sqs.sendMessage(params).promise();
    console.log(
      "Send event %s succesfully to the queue %s",
      body,
      BREED_MGDC_QUEUE_URL
    );
  } catch (err) {
    console.error("Failed to send breed event to queue", err);
  }
};