import {pipe, sum} from "ramda";
import { splitBySingleCarriageReturn, trim } from "../utils";

const parseEntry = (entry: string) => {
    const parser = pipe(
        trim,
        splitBySingleCarriageReturn,
    );
    return parser(entry);
}

const pickNumbers = (line) => {
    const regex = /\d/g;
    return line.match(regex);
}

const keepExtremityElements = (acc, el) => {
    console.log('el', el)

    if (Array.isArray(el) && el.length > 0) {
        return [...acc, [Number(el[0]), Number(el[el.length - 1])].join('')]
    }
    return [...acc];
}


const sum = (acc, el) => {
    return Number(acc) + Number(el);
}

const validNumbers = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
]

function extractDigits(inputString) {
    // Définition des équivalences chiffre-lettre
    const digitMap = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9
    };

    // Fonction pour extraire le premier et le dernier chiffre de chaque ligne
    function extractFirstAndLastDigit(line) {
        const digits = line.match(/one|two|three|four|five|six|seven|eight|nine|\d/g);
        console.log('digits', digits)
        const firstDigit = digits ? digits[0] : null;
        const lastDigit = digits ? digits[digits.length - 1] : null;

        return {
            firstDigit: digitMap[firstDigit] || parseInt(firstDigit, 10),
            lastDigit: digitMap[lastDigit] || parseInt(lastDigit, 10)
        };
    }

    // Séparation des lignes et extraction des chiffres pour chaque ligne
    const lines = inputString.trim().split('\n').map(str => str.trim());
    console.log('lines', lines);
    const results = lines.map(line => extractFirstAndLastDigit(line));

    return results;
}

export const execute = (entry) => {
    // const entryParsed = parseEntry(entry);
    // const lines = entryParsed.map(pickNumbers)
    // const numbersFiltered = lines.reduce(keepExtremityElements, [])
    // console.log('numbersFiltered', numbersFiltered)
    // return numbersFiltered.reduce(sum, 0)
    return extractDigits(entry)
        .map(obj => `${obj.firstDigit}${obj.lastDigit}`)
        .reduce((acc, el) => acc + Number(el), 0);
}