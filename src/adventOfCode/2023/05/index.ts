import {pipe, range, splitEvery} from "ramda";

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
    // console.log('nMap', nMap)
    return nMap;
}

type ArrayOf = <T>(start: number, length: number) => T[];
export const arrayOf: ArrayOf = (start, length) => Array.from({length}, (_, idx) => (start-1)+idx+1)

const generateSourceDestinationMap = (nMap, sourceRange, destinationRange) => {
    arrayOf(0, sourceRange.length).forEach((_, idx) => {
        const source = sourceRange[idx];
        const destination = destinationRange[idx];
        nMap.set(source, destination);
    })

    return nMap;
}

const getStartOfRange = (idx, batchSize) => idx * batchSize
const getEndOfRange = (idx, batchSize) => ((idx + 1) * batchSize) - 1;
export const createRanges = (arrSize, batchSize) => {
    const nbRange = Math.ceil(arrSize / batchSize);
    return arrayOf(0, nbRange).map((range, idx) =>
        [getStartOfRange(idx, batchSize), getEndOfRange(idx, batchSize)])
}

export const createRangesV2 = (start, arrayLength, batchSize = 0) => {
    return [start, start + arrayLength - 1];
}

const generateMapEntries = (nMap) => (line) => {
    const [dest, start, length] = line;
    const sourceRange = arrayOf(start, length);
    const destinationRange = arrayOf(dest, length);
    return generateSourceDestinationMap(nMap, sourceRange, destinationRange);
}

export const generateMap = (srcToDestMap) => {
    const nMap = new Map()
    srcToDestMap.forEach(generateMapEntries(nMap));
    return nMap;
}

export const getter = (nMap, key) => nMap.has(key)
    ? nMap.get(key)
    : key;

export const pathMapResolver = (nMaps, seed) => {
    return nMaps.reduce((acc, nMap) => {
        return getter(nMap, acc);
    }, seed);
}

const getDestinationValue = (srcValue, srcDestMap) =>
    getter(srcDestMap, srcValue);

const t = (keys, srcValue, newValue, seedValue, entryMap) => (acc, el, idx) => {
    const key = keys.next().value;

    if (key !== 'seeds') {
        srcValue = newValue || seedValue
        const currentValue = entryMap.get(key)
        newValue = getDestinationValue(srcValue, generateMap(currentValue))
    }

    return newValue
}

const getLocationForCurrentSeed = (entryMap, size) => (seedValue) => {
    const keys = entryMap.keys();

    let srcValue = seedValue;
    let newValue;

    return arrayOf(0, size)
        .reduce(
            t(keys, srcValue, newValue, seedValue, entryMap)
            , 0
        )
}

export const getMinLocation = (entryMap) => {
    const size = entryMap.size;

    const seeds = entryMap.get('seeds')

    const locations = seeds.map(getLocationForCurrentSeed(entryMap, size))

    return getMinFromArr(locations);
}

const findRange = (seed, currentValue) => {
    // console.log('seed', seed)
    // console.log('currentValue', currentValue)
    return currentValue.find((range) => {
        const [dest, start, length] = range;
        return seed >= start && seed <= start + length
    })
}

export const getMinLocationV2 = (entryMap) => {
    const size = entryMap.size;

    const seeds = entryMap.get('seeds')

    const locations = seeds.map((seed) => {
        // console.log('seed', seed)
        const keys = entryMap.keys();
        let newValue;
        const path = [];

        for(let i = 0; i < size; i++) {
            const key = keys.next().value;

            if (key !== 'seeds') {
                // console.log('key', key)
                const currentValue = entryMap.get(key)
                newValue = newValue || seed
                // console.log('find range for newValue', newValue)
                const range = findRange(newValue, currentValue)
                // console.log('range', range)
                if (range) {
                    const [dest, start, length] = range;
                    const diff = newValue - start;
                    newValue = dest + diff;
                    // console.log('newValue', newValue)
                    // path.push(newValue)
                }
                // else {
                //     // newValue = newValue || seed;
                //     console.log('newValue', newValue)
                //     // path.push(newValue)
                //
                // }
            }
        }

        return newValue
    })

    return getMinFromArr(locations);
}

export const getMinLocationV3 = (entryMap) => {
    const size = entryMap.size;

    const seeds = entryMap.get('seeds')
    const seeds2 = splitEvery(2, seeds)

    const locations = seeds2.map((seed) => {
        const [start, length] = seed;
        const newSeeds = range(start, start+length)

        return newSeeds.map((seed) => {
            const keys = entryMap.keys();
            let newValue;

            for(let i = 0; i < size; i++) {
                const key = keys.next().value;

                if (key !== 'seeds') {
                    const currentValue = entryMap.get(key)
                    newValue = newValue || seed
                    const range = findRange(newValue, currentValue)
                    if (range) {
                        const [dest, start, length] = range;
                        const diff = newValue - start;
                        newValue = dest + diff;
                    }
                }
            }

            return newValue
        })
    })

    // const locations = seeds.map((seed) => {
    //
    //     const keys = entryMap.keys();
    //     let newValue;
    //     const path = [];
    //
    //     for(let i = 0; i < size; i++) {
    //         const key = keys.next().value;
    //
    //         if (key !== 'seeds') {
    //             // console.log('key', key)
    //             const currentValue = entryMap.get(key)
    //             newValue = newValue || seed
    //             // console.log('find range for newValue', newValue)
    //             const range = findRange(newValue, currentValue)
    //             // console.log('range', range)
    //             if (range) {
    //                 const [dest, start, length] = range;
    //                 const diff = newValue - start;
    //                 newValue = dest + diff;
    //                 // console.log('newValue', newValue)
    //                 // path.push(newValue)
    //             }
    //             // else {
    //             //     // newValue = newValue || seed;
    //             //     console.log('newValue', newValue)
    //             //     // path.push(newValue)
    //             //
    //             // }
    //         }
    //     }
    //
    //     return newValue
    // })

    return getMinFromArr(locations.flat());
}

export const getMinFromArr = (arr) => Math.min(...arr);
