import { pipe } from "ramda";

const trim = (str) => str.trim();
const splitBy = (separator) => (str) => str.split(separator);
const splitByDoubleCarriageReturn = splitBy("\n\n");
const keyValueSeparator = splitBy(": ");
const splitBySpace = splitBy(" ");
const map = (fn) => (arr) => arr.map(fn);
const mapToNumber = map(Number)
const arrayToNumbers = (arr) => mapToNumber(arr);
const filter = (fn) => (arr) => arr.filter(fn);
const forEach = (fn) => (arr) => {
    arr.forEach(fn);
}
const getArrEl = (idx) => (arr) => arr[idx];
const isArray = (val) => Array.isArray(val);
const isObject = (val) => !Array.isArray(val) && typeof val === 'object'
const startsWith = (str) => (val) => val.startsWith(str);

const contentParser = pipe(
    trim,
    splitByDoubleCarriageReturn,
)

const transformer = pipe(
    splitBySpace,
    arrayToNumbers,
);
const seedFormatter = map(transformer);

const headerSeedTransformer = pipe(
    keyValueSeparator,
    getArrEl(1),
    splitBySpace,
    arrayToNumbers,
)

const isHeaderLine = (lineNumber) => lineNumber === 0;

const populateMap = (entryMap) => (line, lineNumber) => {
    if (isHeaderLine(lineNumber)) {
        entryMap.set('seeds', headerSeedTransformer(line));
    } else {
        const [key, ...seeds] = line.split('\n');
        const mapKey = key.replace(' map:', '');
        entryMap.set(mapKey, seedFormatter(seeds));
    }
}

export const parseEntry = (obj) => {
    const entryMap = new Map();
    console.log('obj', contentParser(obj))
    contentParser(obj).forEach(populateMap(entryMap));
    return entryMap;
}
