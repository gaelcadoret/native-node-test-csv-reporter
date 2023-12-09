import { messagingController } from "../../utils/index.js";

const loopListener = (workers) => (data) => {
    console.log('loop has receive a new message =>', data)
    workers.loop.performance.eventLoopUtilization();

    messagingController(workers, data);

    if (data.terminate) {
        workers.loop.terminate();
    }
}

export default loopListener;
