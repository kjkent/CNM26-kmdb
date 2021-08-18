const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const { add, update, remove } = require("./utils");

const app = () => {
  let movieListArr;
  try {
    movieListArr = JSON.parse(fs.readFileSync("./movies.json"));
  } catch (error) {
    movieListArr = [];
  }

  if (argv.add) {
    add(movieListArr, argv.add);
  } else if (argv.list) {
    console.log(movieListArr);
  } else if (argv.update && argv.with) {
    update(movieListArr, argv.update, argv.with);
  } else if (argv.remove) {
    remove(movieListArr, argv.remove);
  } else {
    console.log("Usage: node index.js --add <film> / --list / --update <film> --with <newfilm> / --remove <film>");
  }
};

app();
