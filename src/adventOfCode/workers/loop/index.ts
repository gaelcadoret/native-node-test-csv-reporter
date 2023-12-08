import { parentPort, isMainThread} from 'node:worker_threads';
import {arrayOf, createRanges, createRangesV2} from "../../2023/05";

const workerName = 'loop';

console.log(`[${workerName}] isMainThread`, isMainThread);

;(() => {
    console.log('isMainThread', isMainThread);

    parentPort.on('message', (data) => {
        console.log(`[${workerName}] data from parent`, data);

        // parentPort.postMessage({
        //     origin: workerName,
        //     destination: 'loop2',
        //     message: 'message from worker 1',
        //     timestamp: new Date(Date.now()).toISOString(),
        // })

        if (data.action === 'start') {
            console.log(`[${workerName}] action => start`)

            if (data.type === 'split_big_array') {
                console.log(`[${workerName}] type => split_big_array`)

                const { start, arrayLength, maxBatchSize } = data.data;

                const response1 = createRangesV2(
                    start,
                    arrayLength,
                    maxBatchSize,
                );

                parentPort.postMessage({
                    response: response1,
                    success: true,
                    type: 'split_big_array',
                    origin: workerName,
                    terminate: true,
                    timestamp: new Date(Date.now()).toISOString()
                })
            }

            if (data.type === 'process_range') {
                console.log(`[${workerName}] type => process_range`)

                const { range, idx, length } = data.data;

                console.log('range', range)
                console.log('idx', idx)

                parentPort.postMessage({
                    response: range,
                    idx,
                    length,
                    success: true,
                    type: 'process_range',
                    origin: workerName,
                    terminate: false,
                    timestamp: new Date(Date.now()).toISOString()
                })
            }
        }

        // parentPort.postMessage({
        //     success: true,
        //     origin: workerName,
        //     terminate: true,
        //     timestamp: new Date(Date.now()).toISOString()
        // })
    });

    parentPort.postMessage({
        success: true,
        origin: workerName,
        message: 'worker has been started.',
        timestamp: new Date(Date.now()).toISOString()
    })
})();