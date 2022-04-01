const AWS = require("aws-sdk");

exports.handler = async (event) => {
  console.log("Event intercept by default route", event);
};
