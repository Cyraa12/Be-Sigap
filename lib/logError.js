const fs = require("fs");
const path = require("path");

exports.logError = (message) => {
  console.log(path.resolve(__dirname, "../log.txt"));

  fs.writeFile("log.txt", message);
  return;
};
