import {parentPort, isMainThread} from 'node:worker_threads';

const workerName = 'worker.generic-01';

console.log(`[${workerName}] isMainThread`, isMainThread);

const getDateToIsoString = () => {
    return new Date(Date.now()).toISOString()
}

const add = (a, b) => a + b;
const workerLibrary = {
    add,
}

;(() => {
    console.log('isMainThread', isMainThread);

    parentPort.on('message', (data) => {
        console.log(`${getDateToIsoString()} [${workerName}] data received from parent`);

        if (data.type === 'start') {
            console.log(`${getDateToIsoString()} [${workerName}] action => start`)
        }

        if (data.type === 'execute') {
            console.log(`${getDateToIsoString()} [${workerName}] action => execute`)
            if (typeof data.fn === 'string') {
                const result = workerLibrary[data.fn](...data.args);

                parentPort.postMessage({
                    success: true,
                    type: 'fn.response',
                    origin: workerName,
                    response: result,
                    terminate: true,
                    message: 'Function has been executed successfully.',
                    timestamp: new Date(Date.now()).toISOString()
                })
            }
        }

        if (data.type === 'timeout.start') {
            console.log(`${getDateToIsoString()} [${workerName}] action => timeout.start`)

            setTimeout(() => {
                console.log(`${getDateToIsoString()} [${workerName}] timeout has ended.`)

                parentPort.postMessage({
                    success: true,
                    type: 'timeout.end',
                    origin: workerName,
                    terminate: true,
                    message: 'timeout has ended.',
                    timestamp: new Date(Date.now()).toISOString()
                })
            }, data.timeout);
        }
    });

    parentPort.postMessage({
        success: true,
        type: 'start_succeed',
        origin: workerName,
        message: 'worker has been started.',
        timestamp: new Date(Date.now()).toISOString()
    })
})();