import {pipe, sum} from "ramda";
import { splitBySingleCarriageReturn, trim } from "../utils";

const parseEntry = (entry: string) => {
    const parser = pipe(
        trim,
        splitBySingleCarriageReturn,
    );
    return parser(entry);
}

const parseLines = (lines) => {
    return lines.map((line) => {
        return line
            .split(':')
            .reduce(
                (acc, el) => ({
                    [acc]: el
                        .trim()
                        .split('; ')
                        .map((game) => {
                            return game
                                .split(', ')
                                .reduce((acc, el) => {
                                    const [nb, color] = el.split(' ');
                                    return {
                                        ...acc,
                                        [color]: Number(nb),
                                    }
                                }, {})
                        })
                })
            )
    });
}

const selectBiggerObject = (acc, el) => {
    const accLen = Object.keys(acc).length;
    const elLen = Object.keys(el).length;

    if (accLen === elLen) {
        return acc;
    }

    if (accLen > elLen) {
        return acc;
    }

    return el;

}

/**
 * { blue: 3, red: 4 }
 * { red: 1, green: 2, blue: 6 }
 *
 * { blue: 6, red: 4, green: 2 }
 * @param biggerObject
 * @param el
 */
const overrideKeyForBiggerValue = (biggerObject, el) => {
    const fusion = Object.entries(el).reduce((acc, el) => {
        const [colorEl, nbEl] = el;

        return {
            ...acc,
            [colorEl]: biggerObject?.[colorEl] > nbEl ? biggerObject?.[colorEl] : nbEl,
        }
    }, {})

    return {
        ...biggerObject,
        ...fusion,
    }
}

const getMinSetOfCubes = (game) => {

    return game.reduce((acc, el) => {
        const biggerObject = selectBiggerObject(acc, el);

        const fusion = {
            ...biggerObject,
            ...overrideKeyForBiggerValue(acc, el),
        };

        return fusion
    })
}

export const execute = (entry) => {
    const entryParsed = parseEntry(entry);
    const lines = parseLines(entryParsed);
    const validatedLines = lines
        .map((line) => {
            const [[_, value]] = Object.entries(line);
            return getMinSetOfCubes(value)
        })

    const powers = validatedLines
        .map(
            (set) => Object.values(set)
                .reduce(
                    (acc, el) => acc * el
                )
        )
        .reduce((acc, el) => acc + el)

    return JSON.stringify(powers, null, 2);
}