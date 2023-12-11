import { pipe } from "ramda";
import {
    directionsWithDiagonals,
    DirectionWithDiagonal,
    isNotNumber,
    isNumber,
    splitBySingleCarriageReturn,
    trim
} from "../utils";

const parseEntry = (entry: string) => {
    const parser = pipe(
        trim,
        splitBySingleCarriageReturn,
    );
    return parser(entry);
}
const hasProperty = (prop) => (obj) => Object.hasOwn(obj, prop);
const hasPropertyLeft = hasProperty('left');
const hasPropertyRight = hasProperty('right');

const getValue = (cell) => {
    if (!cell) {
        return {
            value: null,
        }
    }

    return { ...cell }
}
const neighborsMapper = (x, y, mapArray) => ({dx, dy, direction}: DirectionWithDiagonal) => {
    const colIdx = x + dx;
    const rowIdx = y + dy;

    const cell = mapArray?.[rowIdx]?.[colIdx];

    return {
        direction,
        ...getValue(cell),
    }
}
const getNeighbors = (x, y, mapArray) => ({
    neighbors: directionsWithDiagonals.map(neighborsMapper(x, y, mapArray)),
})

type Cell = {
    x: number
    y: number
    value: string
}
type Row = Cell[]
type Rows = Row[]
function parseMap(mapArray) {
    return mapArray.map((row, y) => {
        return row.split('').map((value, x) => {
            return {
                x,
                y,
                value,
            }
        })
    })
}

const enrichNeighbors = (mapArray: Rows) => {
    return mapArray.map((row, y) => {
        return row.map((cell, x) => {
            return {
                ...cell,
                ...getNeighbors(x, y, mapArray),
            }
        })
    })
}

export const execute = (entry) => {
    const entryParsed = parseEntry(entry);
    const result = parseMap(entryParsed);
    const t = enrichNeighbors(result);
    return JSON.stringify(t, null, 2);
}