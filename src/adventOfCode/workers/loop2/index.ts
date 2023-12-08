import { parentPort, isMainThread } from 'node:worker_threads';

const workerName = 'loop2';

;(() => {
    console.log('isMainThread', isMainThread);

    parentPort.on('message', (data) => {
        console.log(`[${workerName}] data from parent`, data);

        if (data.action === 'start') {
            let n = 1000;
            while (n--) Math.sin(n);

            parentPort.postMessage({
                n,
                origin: workerName,
                success: true,
                terminate: true,
                timestamp: new Date(Date.now()).toISOString()
            })
        }
    });

    parentPort.postMessage({
        success: true,
        origin: workerName,
        message: 'worker has been started.',
        timestamp: new Date(Date.now()).toISOString()
    })
})();