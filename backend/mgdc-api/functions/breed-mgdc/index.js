const AWS = require("aws-sdk");

const { MGDC_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);
  const record = event.Records[0];
  const breed = JSON.parse(record.body);

  const { mgdcId } = breed;

  const params = {
    TableName: MGDC_DB,
    Key: { id: mgdcId.toString() },
    UpdateExpression: "SET #has = :breed, #tschanged = :tschanged",
    ExpressionAttributeNames: { "#has": "hasBreed", "#tschanged": "tschanged" },
    ExpressionAttributeValues: {
      ":breed": "true",
      ":tschanged": new Date().getTime(),
    },
  };

  try {
    await clientdb.update(params).promise();
    console.log("Update successfully");
  } catch (err) {
    console.error("Failed to update breed", err);
  }
};
