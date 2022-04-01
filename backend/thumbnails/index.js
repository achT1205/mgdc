const sharp = require("sharp");
const fs = require("fs");
const request = require("request");
const progress = require("request-progress");
const mgdc = require("./data.json");
const done = require("./done.json");
const pre = "----";
const ORIGINAL_FOLDER = "./images/original";
const RESIZED_FOLDER = "./images/resized";

const downloadManager = function (url, filename) {
  const writeStream = fs.createWriteStream(`${ORIGINAL_FOLDER}/${filename}`);
  progress(request(url), {
    throttle: 500,
  })
    .on("progress", function (state) {
      process.stdout.write(pre + "" + Math.round(state.percent * 100) + "%");
    })
    .on("error", function (err) {
      console.log("error :( ", err);
    })
    .on("end", function () {
      writeStream.close();
      console.log(pre + "100% \n Download Completed");
      //sharp(`${ORIGINAL_FOLDER}/${filename}`)
      //  .resize(200)
      //  .toFile(`${RESIZED_FOLDER}/${filename}`);
    })
    .pipe(writeStream);
};

const resizeImage = (id) => {
  sharp(`${ORIGINAL_FOLDER}/${id}.png`)
    .resize(410, 410)
    .toFile(`${RESIZED_FOLDER}/${id}.png`);
};

//const done = [];
//const isFileExist = (filename) => {
//  try {
//    if (fs.existsSync(`${ORIGINAL_FOLDER}/${filename}`)) {
//      done.push(filename.split(".")[0]);
//      return true;
//    }
//  } catch (err) {
//    console.error("Failed to check if file exist", err);
//  }
//  return false;
//};

//const isAlreadyDone = (id) => {
//  return done.indexOf(id + "") >= 0;
//};

mgdc.forEach((elmt) => {
  console.log("File", elmt.id);
  resizeImage(elmt.id);
});

// console.log("Total of michtos", mgdc.length); // 5601
//for (let index = 0; index < 200; index++) {
//  const elmt = mgdc[index];
//  const filename = `${elmt.id}.png`;
//  if (isAlreadyDone(elmt.id)) {
//    console.log("File with name %s already exist", filename);
//    continue;
//  }
//  downloadManager(elmt.image, filename);
//}

//try {
//  fs.writeFileSync("./images/done.json", JSON.stringify(done));
//  //file written successfully
//} catch (err) {
//  console.error(err);
//}
