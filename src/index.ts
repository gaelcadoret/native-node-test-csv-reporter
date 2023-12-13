import {arrayOf} from "./adventOfCode/2023/utils";

;(() => {
    console.log('script start...');

    const getTime = () => new Date(Date.now()).toISOString();

    const showRecursiveLog = (loop, idx) => () => {
        console.log(`${getTime()}: [${loop}] recursive log - ${idx}`);
        setTimeout(showRecursiveLog(loop, idx + 1), 2000)
        return;
    }

    ["loop1", "loop2"].forEach((loop) => {
        setTimeout(showRecursiveLog(loop, 1), 2000)
    })


})();