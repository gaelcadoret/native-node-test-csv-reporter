import fs from "fs";
import parseCsvContent from "./modules/utils/parseCsvContent";
import buildTreeRecursive from "./modules/generateTree";
import generateTree from "./modules/generateTree";
import prompts from 'prompts';

    /**
     * Generate QRCode data to be encrypt
     * @param key
     */
;(async () => {
    console.log('script start...');

    // const xmlContent = fs.readFileSync('./src/modules/__mocks__/030124.xml', 'utf8');

    // const jsonFromXml = parseXmlContent(xmlContent)
    const csvContent = await parseCsvContent('./src/modules/__mocks__/product-master-data-examples-CSV-3.csv')
    console.log('csvContent', csvContent.length)

    for (var i = 0; i < csvContent.length; i++) {
        // Vous pouvez traiter chaque ligne comme vous le souhaitez ici
        console.log("Index =>", i)
        console.log("Content =>", csvContent[i]);
    }

    // const levels = ['Generic Name', 'ProductName', 'Product form', 'Strength', 'Major Country'];
    // const tree = generateTree(csvContent, levels);

    // const jsonTree = JSON.stringify(tree, null, 2);
    // console.log(jsonTree);

    // const response = await prompts({
    //     type: 'number',
    //     name: 'value',
    //     message: 'How old are you?',
    //     validate: value => value < 18 ? `Nightclub is 18+ only` : true
    // });
    //
    // console.log(response);

    // const response2 = await prompts({
    //     type: 'select',
    //     name: 'value',
    //     message: 'Pick a color',
    //     choices: [
    //         { title: 'Red', value: '#ff0000' },
    //         { title: 'Green', value: '#00ff00' },
    //         { title: 'Blue', value: '#0000ff' }
    //     ],
    // })
    // console.log(response2);

    const formatQuestion = ([key, value]) => ({
        title: key,
        value: value,
    })

    const promptQuestions = async (tree, levels) => {
        const currentLevelData = Object.entries(tree)

        const currentLevelQuestions = currentLevelData.map(formatQuestion)

        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a color',
            choices: currentLevelQuestions
        })

        if (levels.length > 1) {
            const [_, ...newLevels] = levels
            return await promptQuestions(response.value, newLevels)
        }

        return response
    }

    // const response = await promptQuestions(tree, levels)

    // console.log('response', response)

    // créer une fonction révolutionnaire en Node JS qui va changer le monde. J'aimerais que tu me fasses une série de prompt permettant de choisir quels type de serveur http on souhaite (fastify, express, etc.) ainsi que
    // les différentes routes à exposer.
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Which HTTP server do you want to use?',
        choices: [
            { title: 'Fastify', value: 'fastify' },
            { title: 'Express', value: 'express' },
        ],
    }, {
        type: 'select',
        name: 'value',
        message: 'Will you need a database?',
        choices: [
            { title: 'None', value: 'None' },
            { title: 'Postgres', value: 'Postgres' },
            { title: 'MySQL', value: 'MySQL' },
            { title: 'MongoDB', value: 'MongoDB' },
        ],
    }, {
        type: 'select',
        name: 'value',
        message: 'Will you need to have a cache?',
        choices: [
            { title: 'None', value: 'None' },
            { title: 'Redis', value: 'Redis' },
            { title: 'Memcached', value: 'Memcached' },
        ],
    }, {
        type: 'select',
        name: 'value',
        message: 'Will you need to have private routes?',
        choices: [
            { title: 'None', value: 'None' },
        ],
    })

    console.log('the end.')
})();