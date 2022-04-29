const AWS = require("aws-sdk");

const { MGDC_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

const READ_PROPERTIES = [
  "hasBreed",
  "image",
  "tscreated",
  "id",
  "name",
  "hasMatched",
];

exports.handler = async (event) => {
  console.log("Event", event);

  if (!event.body) {
    console.error("Bad request: body is required");
    return {
      statusCode: 400,
      body: "Bad request: body is required",
    };
  }
  const { id } = event.pathParameters;
  const data = JSON.parse(event.body);

  try {
    const params = buildDbParams(id, data);
    if (Object.keys(params).length > 0) {
      const response = await clientdb.update(params).promise();
      console.log(
        `MGDC ${id} was updated successfully`,
        JSON.stringify(response)
      );
    } else {
      console.warn("Query is empty, skip update");
    }
    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.error("Failed to update MGDC", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const buildDbParams = (id, data) => {
  const params = {
    TableName: MGDC_DB,
    Key: { id },
  };
  const updateExpressions = [];
  params["ExpressionAttributeNames"] = {};
  params["ExpressionAttributeValues"] = {};
  for (const [key, value] of Object.entries(data)) {
    if (!READ_PROPERTIES.includes(key)) {
      addExpression(updateExpressions, params, key, value);
    }
  }
  if (updateExpressions.length === 0) {
    console.warn("There is no proprety to update of MGDC");
    return {};
  }

  addExpression(updateExpressions, params, "tschanged", new Date().getTime());
  params["UpdateExpression"] = `SET ${updateExpressions.join(", ")}`;
  console.log("Query parameters update of MGDC", JSON.stringify(params));
  return params;
};

const addExpression = (updateExpressions, params, key, value) => {
  updateExpressions.push(`#${key} = :${key}`);
  params["ExpressionAttributeNames"][`#${key}`] = key;
  params["ExpressionAttributeValues"][`:${key}`] = value;
};
