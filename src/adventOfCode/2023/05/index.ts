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

const nMap = new Map();
const entryMapSet = (key: string) => (val: any) => nMap.set(key, val);
const entryMapSetSeeds = entryMapSet('seeds');

const populateMap = (line, lineNumber) => {
    if (isHeaderLine(lineNumber)) {
        entryMapSetSeeds(headerSeedTransformer(line));
    } else {
        const [key, ...seeds] = line.split('\n');

        const mapKey = key.replace(' map:', '');
        const entryMapSetKey = entryMapSet(mapKey);
        entryMapSetKey(seedFormatter(seeds))
    }
}

const jsonStringifyNmap = (nMap) => JSON.stringify(Array.from(nMap.entries()))
const jsonToMap = (jsonText) => new Map(JSON.parse(jsonText));

export const parseEntry = (obj) => {
    contentParser(obj).forEach(populateMap);
    console.log('nMap', nMap)
    return nMap;
}

const arrayOf = (start: number, length: number) => Array.from({length}, (_, idx) => (start-1)+idx+1)

const generateSourceDestinationMap = (nMap, sourceRange, destinationRange) => {
    arrayOf(0, sourceRange.length).forEach((_, idx) => {
        const source = sourceRange[idx];
        const destination = destinationRange[idx];
        nMap.set(source, destination);
    })

    return nMap;
}

const generateMapEntries = (nMap) => (line) => {
    const [dest, start, length] = line;
    const sourceRange = arrayOf(start, length);
    const destinationRange = arrayOf(dest, length);
    return generateSourceDestinationMap(nMap, sourceRange, destinationRange);
}

export const generateMap = (srcToDestMap, maxFromMaps, maxValue) => {
    const nMap = new Map()

    srcToDestMap.forEach(generateMapEntries(nMap));
    const mapOfNVals = arrayOf(0, maxFromMaps+1);

    mapOfNVals.forEach((idx) => {
        if (!nMap.has(idx) && idx <= maxValue) {
            nMap.set(idx, idx);
        } else {
            if (nMap.has(idx)) {
                if (idx > maxValue) {
                    nMap.delete(idx);
                }
            }
        }
    })
    // console.log('nMap', nMap)
    return nMap;
}
export const getMaxFromArray = (arr) => Math.max(...arr);
export const getMaxFromMap = (nMap, mapKey) => {
    const lines = nMap.get(mapKey)
    const maxs = lines.map(([_, start, length]) => start + length - 1);
    return getMaxFromArray(maxs);
}
export const getMaxHeaderValue = (nMap, key) => Math.max(...nMap.get(key))
