import path from "path";
import { useWorker } from "./utils";

const __dirname = new URL('.', import.meta.url).pathname
const _dirname = path.dirname(__dirname);

export type WorkerOptions = {
    args: any[]
    _dirname: string
}

/**
 * ...*......
 * ..35..633.
 * ......#...
 * 617*......
 * .....+.58.
 * ..592.....
 * ......755.
 * ...$.*....
 * .664.598..
 */

const entry = `
467..114..
...*......
`;

const options: WorkerOptions = {args: [entry], _dirname}
useWorker('execute', options)

// const options: WorkerOptions = {args: [12, 24], _dirname}
// useWorker('add', options)
