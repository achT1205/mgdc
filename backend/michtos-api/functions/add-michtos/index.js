const AWS = require("aws-sdk");

const { MICHTOS_DB } = process.env;
const clientdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Event", event);

  if (!event.body) {
    console.error("Bad request: body is required");
    return {
      statusCode: 400,
      body: "Bad request: body is required",
    };
  }

  const data = event.body;
  const batchRequest = data.map((elmt) => {
    elmt.id = elmt.id + "";
    elmt.hasBreed = elmt.hasBreed + "";
    return {
      PutRequest: {
        Item: {
          ...elmt,
          tscreated: new Date().getTime(),
        },
      },
    };
  });

  try {
    for (let index = 0; index < batchRequest.length; index += 25) {
      const end =
        index + 25 < batchRequest.length
          ? index + 25
          : batchRequest.length - index;
      const chunck = batchRequest.slice(index, end);
      await batchWrite(chunck);
      console.log("Add successfully", index);
    }
    return {
      statusCode: 202,
    };
  } catch (err) {
    console.error("Failed to store michtos", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const batchWrite = async (chunck) => {
  if (chunck.length === 0) {
    return;
  }
  console.log("Adding %s items...", chunck.length);

  const params = {};
  params["RequestItems"] = {};
  params["RequestItems"][MICHTOS_DB] = chunck;
  await clientdb.batchWrite(params).promise();
};
