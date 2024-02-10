import csv from "csv-parser";
import fs from "fs";

function parseCSVWithLineBreaks(csvData) {
    // Définir une expression régulière qui correspond à une ligne avec un saut de ligne dans un champ
    var regex = /("[^"]*[\n\r]+[^"]*")|([^,\n\r]+)|[\n\r]+/g;

    // Diviser la chaîne CSV en lignes en utilisant l'expression régulière
    var lines = csvData.match(regex);

    // Traitement des lignes
    for (var i = 0; i < lines.length; i++) {
        // Vous pouvez traiter chaque ligne comme vous le souhaitez ici
        console.log(lines[i]);
    }
}

const parseCsvContentOld = (file) => {
    const txtContent = fs.readFileSync(file, 'utf8');

    var regex = /("[^"]*[\n\r]+[^"]*")|([^,\n\r]+)|[\n\r]+/g;

    // Diviser la chaîne CSV en lignes en utilisant l'expression régulière
    var lines = txtContent.match(regex);

    return lines;
    // const lines = txtContent.split('\n')
    // const result = []
    // const headers = lines[0].split(';')
    // for (let i = 1; i < lines.length; i++) {
    //     const obj = {}
    //     const currentline = lines[i].split(',')
    //     for (let j = 0; j < headers.length; j++) {
    //         obj[headers[j]] = currentline[j]
    //     }
    //     result.push(obj)
    // }
    // return result
}

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