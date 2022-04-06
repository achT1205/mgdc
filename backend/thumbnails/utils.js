const fs = require("fs");
const done = require("./output.json");
const todo = require("./todo.json");

const writeContent = (fileContent) => {
  try {
    fs.writeFileSync("./todo.json", JSON.stringify(fileContent));
    console.log("There are some todo");
  } catch (err) {
    console.error(err);
  }
};

let contents = done.Contents;
const result = [];
contents = contents.map((e) => e.Key.split("/")[2].split(".")[0]);
todo.forEach((e) => {
  if (!contents.includes(e.id)) {
    result.push(e);
  }
});

console.log(result);
writeContent(result);
