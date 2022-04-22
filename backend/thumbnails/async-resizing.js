const fs = require("fs");
const sharp = require("sharp");
const async = require("async");
const mgdc = require("./mgdc.json");
const AWS = require("aws-sdk");

// get reference to S3 client
const s3 = new AWS.S3();

const ORIGINAL_FOLDER = "./images/original";

const todo = [];
const BUCKET_NAME = "sam-app-blockchain-repository";
const S3_KEY = "/resized/";

const resizeImage = async (id) => {
  return sharp(`${ORIGINAL_FOLDER}/${id}.png`).resize(415, 415).toBuffer();
};

const pushToS3Bucket = (filename, buffer) => {
  // Upload the thumbnail image to the destination bucket
  const destparams = {
    Bucket: BUCKET_NAME,
    Key: S3_KEY + filename,
    Body: buffer,
    ContentType: "image",
  };
  return s3.putObject(destparams).promise();
};

const thumbnail = async (elmt, callback) => {
  await resizeImage(elmt.id)
    .then((buffer) => pushToS3Bucket(elmt.id + ".png", buffer))
    .then(() => callback())
    .catch((err) => {
      todo.push(elmt);
      console.log("Failed to generate thumbnail", err);
      callback();
    });
};

// create a queue object with concurrency 2
const q = async.queue(function (task, callback) {
  console.log("Resize mgdc id", task.id);
  thumbnail(task, () => {
    callback();
  });
}, 2);

// assign a callback
q.drain(function () {
  console.log("all items have been processed");
  try {
    fs.writeFileSync("./todo.json", JSON.stringify(todo));
  } catch (err) {
    console.error(err);
  }
});

// assign an error callback
q.error(function (err) {
  console.error("task experienced an error", err);
});

const test = [
  {
    id: 1148,
  },
  {
    id: 1154,
  },
  {
    id: 1369,
  },
  {
    id: 1357,
  },
  {
    id: 4092,
  },
  {
    id: 4093,
  },
];
test.forEach((elt) => {
  q.push(elt);
});
