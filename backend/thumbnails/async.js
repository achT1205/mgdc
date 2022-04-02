const fs = require("fs");
const https = require("https");
const sharp = require("sharp");
const async = require("async");
const mgdc = require("./mgdc.json");
const ORIGINAL_FOLDER = "./images/original";
const RESIZED_FOLDER = "./images/resized";

const downloader = function (url, filename, callback) {
  const fileStream = fs.createWriteStream(`${ORIGINAL_FOLDER}/${filename}`);
  https.get(url, (response) => {
    response.pipe(fileStream);
    callback();
    console.log("End downloading");
  });
};

const resizeImage = (id) => {
  console.log("Resize id", id);
  sharp(`${ORIGINAL_FOLDER}/${id}.png`)
    .resize(415, 415)
    .toFile(`${RESIZED_FOLDER}/${id}.png`);
};

const pushToS3Bucket = async (filename, buffer) => {
  // Upload the thumbnail image to the destination bucket
  try {
    const destparams = {
      Bucket: "test-thumbnail-mgdc",
      Key: "/test/" + filename,
      Body: buffer,
      ContentType: "image",
    };

    const putResult = await s3.putObject(destparams).promise();
  } catch (error) {
    console.log(error);
    return;
  }
};

// create a queue object with concurrency 2
const q = async.queue(function (task, callback) {
  console.log("Start downloading file " + task.id);
  const filename = `${task.id}.png`;
  downloader(task.image, filename, () => {
    callback();
  });
}, 2);

// assign a callback
q.drain(function () {
  console.log("all items have been processed");
});

// assign an error callback
q.error(function (err, task) {
  console.error("task experienced an error", err);
});

const test = [
  {
    id: 0,
    image:
      "https://ipfs.io/ipfs/QmYpz9sgBezYk4A19FnP9agrvU7RxDzLcES83mbvTp39pp/1572.png",
    name: "MGDC #0",
    hasBreed: false,
  },
  {
    id: 1,
    image:
      "https://ipfs.io/ipfs/QmPgtSCqzzpx2RUXkAyXZYES2oeqofN6roh9rCRtceFTwL/2494.png",
    name: "MGDC #1",
    hasBreed: false,
  },
];
mgdc.forEach((elt) => {
  q.push(elt);
});
