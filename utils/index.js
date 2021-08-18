const fs = require("fs");

const save = (updatedArr) => {
    let stringyObject = JSON.stringify(updatedArr, null, 2);
    fs.writeFileSync("./movies.json", stringyObject);
}

exports.add = (arr, input) => {
    let movieObject = { movie: input };
    arr.push(movieObject);
    save(arr);
}

exports.update = (arr, existing, update) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].movie == existing) {
            arr[i].movie = update;
        }
    }
    save(arr);
}

exports.remove = (arr, toRemove) => {
    let spliceIndex;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].movie == toRemove) {
            spliceIndex = i;
            arr.splice(spliceIndex, 1);
        }
    }
    save(arr);
}

// Can also export with
// module.exports = {
//     module
// }