const AWS = require("aws-sdk");

const { MGDC_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  const params = {
    TableName: MGDC_DB,
  };

  try {
    const result = [];
    let items;
    do {
      items = await clientdb.scan(params).promise();
      items.Items.forEach((item) => result.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("Failed to load mgdc", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
