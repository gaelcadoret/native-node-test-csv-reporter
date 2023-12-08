import { isMainThread } from "node:worker_threads";

const messagingController = (workers, data) => {
    if (data.destination) {
        console.log('\n[messagingController] isMainThread', isMainThread)

        console.table(
            workers[data.destination].performance.eventLoopUtilization()
        );

        console.table({
            origin: data.origin,
            destination: data.destination,
        })

        console.log('\n')

        if (data.destination) {
            workers[data.destination].postMessage(data);
        }
    }


}

export default messagingController;