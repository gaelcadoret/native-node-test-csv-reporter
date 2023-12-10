import {pipe} from "ramda";
import { Worker } from "node:worker_threads";

export const trim = (str) => str.trim();
export const splitBy = (separator) => (str) => str.split(separator);
export const splitByDoubleCarriageReturn = splitBy("\n\n");
export const splitBySingleCarriageReturn = splitBy("\n");
export const keyValueSeparator = splitBy(": ");
export const splitBySpace = splitBy(" ");
export const map = (fn) => (arr) => arr.map(fn);
export const mapToNumber = map(Number)
export const arrayToNumbers = (arr) => mapToNumber(arr);
export const filter = (fn) => (arr) => arr.filter(fn);
export const forEach = (fn) => (arr) => {
    arr.forEach(fn);
}
export const getArrEl = (idx) => (arr) => arr[idx];
export const isArray = (val) => Array.isArray(val);
export const isObject = (val) => !Array.isArray(val) && typeof val === 'object'
export const startsWith = (str) => (val) => val.startsWith(str);

export const contentParser = pipe(
    trim,
    splitByDoubleCarriageReturn,
)

export const transformer = pipe(
    splitBySpace,
    arrayToNumbers,
);

export const jsonStringifyNmap = (nMap) => JSON.stringify(Array.from(nMap.entries()))
export const jsonToMap = (jsonText) => new Map(JSON.parse(jsonText));

type ArrayOf = <T>(start: number, length: number) => T[];
export const arrayOf: ArrayOf = (start, length) => Array.from({length}, (_, idx) => (start-1)+idx+1)

export const getStartOfRange = (idx, batchSize) => idx * batchSize
export const getEndOfRange = (idx, batchSize) => ((idx + 1) * batchSize) - 1;
export const createRanges = (arrSize, batchSize) => {
    const nbRange = Math.ceil(arrSize / batchSize);
    return arrayOf(0, nbRange).map((range, idx) =>
        [getStartOfRange(idx, batchSize), getEndOfRange(idx, batchSize)])
}

const pickNumbers = (line) => {
    const regex = /\d/g;
    return line.match(regex);
}
function extractAllDigit(str) {
    return str.match(/one|two|three|four|five|six|seven|eight|nine|\d/g);
}

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