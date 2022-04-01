const AWS = require("aws-sdk");

const { MICHTOS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  const params = {
    TableName: MICHTOS_DB,
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
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("Failed to load michtos", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
