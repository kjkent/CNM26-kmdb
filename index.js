require("dotenv").config();
const mongoose = require("mongoose");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

mongoose.connect(
    `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connected");
});

const Movie = mongoose.model(
    "Movie",
    {
        title: {
            type: String,
            required: true
        },
        year: {
            type: Number
        },
        imdb: {
            type: String
        },
        rt: {
            type: String
        },
        comment: {
            type: String,
            default: "No comment added"
        }
    }
);

const app = async () => {
    if (argv.add) {
        const movie = new Movie({
            title: argv.add,
            year: argv.year,
            imdb: argv.imdb,
            rt: argv.rt,
            comment: argv.comment
        });
        await movie.save();
        console.log(movie);
    } else if (argv.list) {
        const list = await Movie.find({});
        console.log(list);
    } else if (argv.find) {
        const result = await Movie.find({title: argv.find});
        console.log(result);
    } else if (argv.update && argv.comment) {
        const updatedMovie = await Movie.updateOne({title: argv.update}, {comment: argv.comment});
        console.log(updatedMovie);
    } else if (argv.remove) {
        const deletedMovie = await Movie.deleteOne({title: argv.remove});
        console.log(deletedMovie);
    } else {
        console.log("Usage: node index.js --add <movie> / --list / --find <movie>/ --update <film> --comment <comment> / --remove <film>");
    }
    process.exit();
};

app();
