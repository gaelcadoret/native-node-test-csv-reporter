import {pipe, sum} from "ramda";
import { splitBySingleCarriageReturn, trim } from "../utils";

const parseEntry = (entry: string) => {
    const parser = pipe(
        trim,
        splitBySingleCarriageReturn,
    );
    return parser(entry);
}

function parseMap(mapArray) {
    const result = [];

    for (let i = 0; i < mapArray.length; i++) {
        for (let j = 0; j < mapArray[i].length; j++) {
            const symbol = mapArray[i][j];

            if (/\d/.test(symbol)) {
                const number = getNumber(mapArray, i, j);
                const touchSymbol = numberTouchesSymbol(mapArray, number);
                result.push({
                    number: number,
                    x: j,
                    y: i,
                    touchSymbol: touchSymbol,
                });
            }
        }
    }

    return result;
}




function numberTouchesSymbol(mapArray, number) {
    for (let i = 0; i < mapArray.length; i++) {
        for (let j = 0; j < mapArray[i].length; j++) {
            if (/\D/.test(mapArray[i][j]) && mapArray[i][j] !== '.') {
                const symbolTouches = touchesSymbolInMap(mapArray, i, j);
                if (symbolTouches) {
                    const symbolNumber = getNumber(mapArray, i, j);
                    if (symbolNumber === number) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

export const execute = (entry) => {
    const entryParsed = parseEntry(entry);
    const result = parseMap(entryParsed);

    return JSON.stringify(result, null, 2);
}