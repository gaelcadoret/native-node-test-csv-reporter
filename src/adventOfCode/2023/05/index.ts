import {pipe, range, splitEvery} from "ramda";
import {isMainThread, parentPort, Worker} from "node:worker_threads";

/**
 * Last response : 183212530
 * FAILED => too high
 */

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

const isLastRange = (nbRange, idx) => nbRange === idx + 1
const getStartOfRange2 = (start, idx, batchSize) => start + (idx * batchSize)
const getEndOfRange2 = (start, idx, batchSize) => start + ((idx + 1) * batchSize) - 1;
export const createRangesV2 = (start, arrayLength, batchSize = 0) => {
    const nbRange = Math.ceil(arrayLength / batchSize);
    const lastRangeLimit = start + arrayLength - 1;

    return arrayOf(0, nbRange).map((range, idx) => {
        const startOfRange = getStartOfRange2(start, idx, batchSize);
        const endOfRange = isLastRange(nbRange, idx)
            ? lastRangeLimit
            : getEndOfRange2(start, idx, batchSize);

        return [startOfRange, endOfRange]
    });
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

export const findRange = (seed, currentValue) => {
    return currentValue.find(([dest, start, length]) => {
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

            for (let i = 0; i < size; i++) {
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
    return getMinFromArr(locations.flat());
}

export const getMinFromArr = (arr) => Math.min(...arr);

export const getMinLocationV4 = (entry, _dirname) => {
    if (isMainThread) {
        const entryMap = parseEntry(entry);
        // assert.equal(getMinLocationV3(entryMap), 46)

        const seeds = entryMap.get('seeds')
        const seedsSplitted = splitEvery(2, seeds)

        // console.log('seedsSplitted', seedsSplitted)

        const workers = {
            loop: new Worker(`${_dirname}/workers/loop`),
            // loop2: new Worker(`${_dirname}/workers/loop2`),
        }

        const minLocations = []

        workers.loop.on('message', (data) => {
            console.log(`[main] data from worker`);
            // console.log('data', data)

            if (data.type === 'split_big_array') {
                const length = data.response.length;

                data.response.forEach((currentRange, idx) => {
                    workers.loop.postMessage({
                        action: 'start',
                        type: 'process_range',
                        data: {
                            range: currentRange,
                            idx,
                            length,
                        }
                    });
                });


            }
            if (data.type === 'process_range_locations') {
                console.log('response from worker (process_range_locations)')

                // console.log('locations', data.response)
                minLocations.push(data.response);

                if (data.idx === data.length - 1) {
                    console.log('Calculate min locations... - length =>', minLocations.length)
                    console.log('locations', minLocations)
                    console.log('min location', getMinFromArr(minLocations))

                    setTimeout(() => {
                        workers.loop.terminate();
                    }, 2000)
                }


                // workers.loop.postMessage({
                //     action: 'start',
                //     type: 'process_range',
                //     data: {
                //         range: data.response[0]
                //     }
                // });
            }
        });
        workers.loop.on('error', (error) => console.error(error));
        workers.loop.on('exit', code => console.log(`Worker exited with code ${code}.`));
        // workers.loop2.on('message', loop2Listener(workers));

        setTimeout(() => {
            console.log('seedsSplitted', seedsSplitted)

            for (let i = 0; i < seedsSplitted.length; i++) {
                const [ start, arrayLength ] = seedsSplitted[i];
                workers.loop.postMessage({
                    action: 'start',
                    type: 'split_big_array',
                    data: {
                        start,
                        arrayLength,
                        maxBatchSize: 50000,
                    }
                });
            }
        }, 1000)

    } else {
        // const data = workerData;
        parentPort.postMessage(`You said what ?`);
    }
}

// export type UseWorker = (fn: string, options: WorkerOptions) => Promise<any>
export const useWorker = (fn, options) => {
    const worker = new Worker(`${options._dirname}/workers/generic`);

    worker.on('message', (data) => {
        if (data.type === 'start_succeed') {
            console.log('Message from worker: Default process has been started...')
            console.log('data', data);

            worker.postMessage({
                origin: 'main',
                type: 'execute',
                fn: fn,
                args: options.args,
                timeout: 10000,
                timestamp: new Date(Date.now()).toISOString()
            })

            worker.postMessage({
                origin: 'main',
                type: 'timeout.start',
                timeout: 10000,
                timestamp: new Date(Date.now()).toISOString()
            })
        }

        if (data.type === 'timeout.end') {
            if (data.terminate) {
                worker.terminate();
            }
        }

        if (data.type === 'fn.response') {
            console.log('Message from worker: function response:')
            console.log('data', data.response);
        }
    })
    worker.on('error', (error) => console.error(error));
    worker.on('exit', code => console.log(`Worker exited with code ${code}.`));

    // worker.postMessage({
    //     success: true,
    //     origin: 'main',
    //     type: 'start',
    //     timestamp: new Date(Date.now()).toISOString()
    // })
}
