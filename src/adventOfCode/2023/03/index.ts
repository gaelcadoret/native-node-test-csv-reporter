import {pipe, groupBy, map, join, prop, values, sum} from "ramda";
import {
    directionsWithDiagonals,
    DirectionWithDiagonal,
    isNumber, isSymbol, isSymbolStar,
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
    if (!cell) return null

    return { ...cell }
}
const neighborsReducer = (x, y, mapArray) => (acc, {dx, dy, direction}: DirectionWithDiagonal) => {
    const colIdx = x + dx;
    const rowIdx = y + dy;

    const cell = mapArray?.[rowIdx]?.[colIdx];

    return {
        ...acc,
        [direction]: getValue(cell)
    }
}
const getNeighbors = (x, y, mapArray) => ({
    neighbors: directionsWithDiagonals.reduce(neighborsReducer(x, y, mapArray), {}),
})

const symbolFilter = (x, y, mapArray) => ({dx, dy, direction}: DirectionWithDiagonal) => {
    const cell = mapArray?.[y + dy]?.[x + dx];
    return isSymbol(cell?.value)
}
const enrichHasSymbolNeighbor = (x, y, mapArray) => {
    const symbolNeighbors = directionsWithDiagonals.find(symbolFilter(x, y, mapArray))
    return {
        hasSymbolNeighbor: symbolNeighbors != null,
    }
}

function createMapCoordinates(mapArray) {
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
                ...enrichHasSymbolNeighbor(x, y, mapArray),
            }
        })
    })
}
const keepOnlySymbolNeighbors = (mapArray: Rows) => {
    return mapArray.map((row, y) => {
        return row.map((cell, x) => {
            if (!cell.hasSymbolNeighbor) {
                return {
                    ...cell,
                    neighbors: null,
                }
            }
            const neighbors = Object.entries(cell.neighbors).reduce((acc, [key, neighborCell]) => {
                if (isSymbolStar(neighborCell?.value)) {
                    return {
                        ...acc,
                        [key]: neighborCell,
                    }
                }
                return acc;
            }, {})
            return {
                ...cell,
                neighbors,
            }

        })
    })
}
const createNeighborIndexKey = (mapArray: Rows) => {
    return mapArray.map((row, y) => {
        return row.map((cell, x) => {
            if (!cell.neighbors) {
                return cell;
            }
            const neighbors = Object.entries(cell.neighbors).reduce((acc, [key, neighborCell]) => {
                const neighborIndexKey = `${neighborCell.x}_${neighborCell.y}_${neighborCell.value}`;
                return {
                    ...acc,
                    [key]: {
                        ...neighborCell,
                        neighborIndexKey,
                    },
                }
            }, {})
            return {
                ...cell,
                neighbors,
            }

        })

    })
}

const compteur = (cPrefix = "default", initialValue = 0) => {
    const prefix = cPrefix
    let count = initialValue
    return {
        get: () => {
            return `${prefix}_${count}`;
        },
        decrement: (step = 1) => {
            count -= step;
        },
        increment: (step = 1) => {
            count += step;
        },
    }
}

const mGroups = () => {
    const groups = new Map();
    return {
        get: (x, y) => groups.get(`${x}_${y}`),
        set: (x, y, value) => groups.set(`${x}_${y}`, value),
        has: (x, y) => groups.has(`${x}_${y}`),
        size: () => groups.size,
        keys: () => groups.keys(),
        values: () => groups.values(),
        entries: () => groups.entries(),
        forEach: (fn) => groups.forEach(fn),
        clear: () => groups.clear(),
        delete: (key) => groups.delete(key),
    }

}

const counter = compteur('group');
const groups = mGroups();

const enrichGroups = (mapArray) => {
    return mapArray.map((row, y) => {
        return row.map((cell, x) => {
            if (isNumber(cell.value)) {
                if (groups.has(x-1, y)) {
                    groups.set(x, y, {
                        ...cell,
                        group: counter.get(),
                    })

                    return {
                        ...cell,
                        group: counter.get(),
                    }
                } else {
                    counter.increment()

                    groups.set(x, y, {
                        ...cell,
                        group: counter.get()
                    })

                    return {
                        ...cell,
                        group: counter.get(),
                    }
                }
            }
            return cell
        })
    })
}
const groupCellsByGroupName = groupBy((el) => el.group);
const groupReducer = (acc, el) => {
    const group = el.filter(hasProperty('group'));
    if (group.length === 0) {
        return acc;
    }

    const cellsByGroupName = groupCellsByGroupName(group);

    return {
        ...acc,
        ...cellsByGroupName,
    }
}
const filterGroups = (arr) => {
    return arr.reduce(groupReducer, {})
}

const filterGroupsAdjacentToSymbol = (obj) => {
    return Object.entries(obj).reduce((acc, [key, cells]) => {
        const hasSymbolNeighbor = cells.some((cell) => cell.hasSymbolNeighbor);
        if (hasSymbolNeighbor) {
            return {
                ...acc,
                [key]: cells,
            }
        }

        return acc
    }, {})
}
type GroupMap = {
    [key: string]: Row
}
const transformNeighborPropToArray = (obj: GroupMap) => {
    return Object.entries(obj).reduce((acc, [key, cells]) => {
        const newCells = cells.map((cell: Cell) => {
            if (!cell.neighbors) return cell;

            const neighborsArray = Object.entries(cell.neighbors).reduce((acc, [_, neighborCell]) => {
                return [
                    ...acc,
                    neighborCell,
                ]
            }, []);
            return {
                ...cell,
                neighbors: neighborsArray,
            }
        })

        return {
            ...acc,
            [key]: newCells,
        };
    }, {})
}
const buildCellsNumber = (obj) => {
    return Object.entries(obj).reduce((acc, entries) => {
        const [key, cells] = entries;

        // const cellsNumber = cells.map((cell) => cell.value).join('');
        const buildCellNumber = pipe(
            map(prop('value')),
            join('')
        )

        return {
            ...acc,
            [key]: buildCellNumber(cells),
        };
    }, {});
}

const sumAllObjValues = pipe(
    values,
    sum,
);

const sumAllNumbers = (obj) => {
    return sumAllObjValues(obj);
return Object.values(obj)
    .reduce((acc, cellsNumber) => {
        return acc + Number(cellsNumber);
    }, 0)
}

const log = (data) => {
    console.log('data', JSON.stringify(data, null, 2));
    return data;
}

const pipeline03 = pipe(
    parseEntry,
    createMapCoordinates,
    enrichNeighbors,
    keepOnlySymbolNeighbors,
    createNeighborIndexKey,
    // log,
    enrichGroups,
    filterGroups,
    filterGroupsAdjacentToSymbol,
    transformNeighborPropToArray,
    log,
    buildCellsNumber,
    sumAllNumbers,
);

export const execute = (entry) => {
    return pipeline03(entry);
}

// result ok = 538046