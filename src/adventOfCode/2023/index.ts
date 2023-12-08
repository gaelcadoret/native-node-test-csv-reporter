import {splitEvery} from "ramda";

const startResourceUsage = process.resourceUsage()
const startTime = process.hrtime();

import {Worker, isMainThread, parentPort} from 'node:worker_threads';
import path from "path";
import {getMinLocationV3, parseEntry} from "./05";
import assert from "node:assert";

// import loopListener from "../workers/loop/listeners";
// import loop2Listener from "../workers/loop2/listeners";

const __dirname = new URL('.', import.meta.url).pathname

const _dirname = path.dirname(__dirname);

const entry = `
        seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
        `

if (isMainThread) {
    const entryMap = parseEntry(entry);
    // assert.equal(getMinLocationV3(entryMap), 46)

    const seeds = entryMap.get('seeds')
    const seedsSplitted = splitEvery(2, seeds)

    console.log('seedsSplitted', seedsSplitted)

    const workers = {
        loop: new Worker(`${_dirname}/workers/loop`),
        // loop2: new Worker(`${_dirname}/workers/loop2`),
    }

    workers.loop.on('message', (data) => {
        console.log(`[main] data from worker`);

        if (data.type === 'split_big_array') {
            console.log('response', data.response)

            // workers.loop.terminate();
            workers.loop.postMessage({
                action: 'start',
                type: 'process_range',
                data: {
                    range: data.response
                }
            });
        }
        if (data.type === 'process_range') {
            console.log('response', data.response)

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
        workers.loop.postMessage({
            action: 'start',
            type: 'split_big_array',
            data: {
                start: seedsSplitted[0][0],
                arrayLength: seedsSplitted[0][1],
                maxBatchSize: 6,
            }
        });
    }, 1000)

} else {
    // const data = workerData;
    parentPort.postMessage(`You said what ?`);
}

const time = process.hrtime(startTime); // nanosecondes
const resourceUsage = process.resourceUsage(startResourceUsage)
const cpuUsage = 100 * 1000 * (resourceUsage.userCPUTime + resourceUsage.systemCPUTime) / (time[0] * 1e9 + time[1]);

console.log('cpuUsage', cpuUsage)