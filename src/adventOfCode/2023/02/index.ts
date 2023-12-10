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

const rules = {
    red: 12,
    green: 13,
    blue: 14,
}

const isValidSet = (set) => {
    return Object.entries(set)
        .every(
            ([color, nb]) => {
                return nb <= rules[color]
            }
        )
}

const isValidGame = (game) => {
    return game.every(isValidSet)
}

export const execute = (entry) => {
    const entryParsed = parseEntry(entry);
    const lines = parseLines(entryParsed);
    const validatedLines = lines
        .filter((line) => {
            const [[_, value]] = Object.entries(line);
            return isValidGame(value)
        })
        .map((game) => {
            const [gameKey] = Object.keys(game);
            return Number(gameKey.split(' ')[1]);
        })

    return validatedLines.reduce((acc, el) => { return acc + el; }, 0); //JSON.stringify(validatedLines, null, 2);
}