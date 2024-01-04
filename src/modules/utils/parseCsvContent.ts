import csv from "csv-parser";
import fs from "fs";

const parseCsvContent = async (file) => new Promise((resolve) => {
    const results = [];

    fs.createReadStream(file)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            resolve(results);
        });
})

export default parseCsvContent