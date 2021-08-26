const mongoose = require("mongoose");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const fetch = require("node-fetch");

require("dotenv").config();

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
        runtime: {
            type: String
        },
        blurb: {
            type: String
        },
        rtScore: {
            type: String
        },
        comment: {
            type: String,
            default: "No comment added"
        }
    }
);

const fetchFromOMDb = async () => {
    const titleURI = encodeURIComponent(argv.add);
    const response = await fetch(`http://www.omdbapi.com/?t=${titleURI}&apikey=${process.env.OMDB_API_KEY}`);
    const json = await response.json();

    const movieInfo = {
        year: json.Year,
        runtime: json.Runtime,
        blurb: json.Plot,
        rtScore: json.Ratings[1].Value
    }

    return movieInfo;
}

const app = async () => {
    if (argv.add) {
        const movieInfo = await fetchFromOMDb();

        const movie = new Movie({
            title: argv.add,
            year: movieInfo.year,
            runtime: movieInfo.runtime,
            blurb: movieInfo.blurb,
            rtScore: movieInfo.rtScore,
            comment: argv.comment
        });

        await movie.save();
        const movieID = movie._id;
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
