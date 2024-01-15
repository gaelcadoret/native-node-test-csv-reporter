import fs from "fs";
import parseCsvContent from "./modules/utils/parseCsvContent";
import buildTreeRecursive from "./modules/generateTree";


    /**
     * Generate QRCode data to be encrypt
     * @param key
     */
;(async () => {
    console.log('script start...');

    // const xmlContent = fs.readFileSync('./src/modules/__mocks__/030124.xml', 'utf8');

    // const jsonFromXml = parseXmlContent(xmlContent)
    const csvContent = await parseCsvContent('./src/modules/__mocks__/product-master-data-examples-CSV-2.csv')
    console.log('csvContent', csvContent)

    const levels = ["Generic Name", "ProductName", "product form", "Strength", "Major Country"];

    // buildTreeRecursive(csvContent, levels);

    // Itérer sur chaque ligne du tableau JSON
    // const tree = csvContent.reduce((acc, row) => {
    //     console.log('row', row)
    //     return acc
    // }, {});

// Convertir l'arbre en format JSON
//     const jsonTree = JSON.stringify(tree, null, 2);

// Imprimer l'arbre JSON
//     console.log(jsonTree);

})();