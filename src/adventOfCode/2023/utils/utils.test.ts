import { describe, it } from "node:test";
import assert from "node:assert";
import {isNumber, isNotNumber, getArrEl, splitBy} from "./";


describe('utils', () => {
    describe('isNumber', () => {
        it('should return true if value is a number', () => {
            assert.equal(
                isNumber(1245),
                true,
            )
            assert.equal(
                isNumber('1245'),
                true,
            )
        })
    })
    describe('isNotNumber', () => {
        it('should return true if value is not a number', () => {
            assert.equal(
                isNotNumber('12a45'),
                true,
            )
            assert.equal(
                isNotNumber('a'),
                true,
            )
            assert.equal(
                isNotNumber('#'),
                true,
            )
            assert.equal(
                isNotNumber('.'),
                true,
            )
            assert.equal(
                isNotNumber('&'),
                true,
            )
        })
    })
    describe('getArrEl', () => {
        it('should return value at a given array index', () => {
            const arr = ["un", "deux", "trois", "quatre", "cinq"]
            const getArrEl2 = getArrEl(2)

            assert.equal(
                getArrEl2(arr),
                "trois",
            )
        })
    })
    describe('splitBy', () => {
        it('should split a string by a given value', () => {
            const splitBySemiColon = splitBy(":")

            const expectedResult = ["un", "deux", "trois", "quatre", "cinq"]

            assert.deepStrictEqual(
                splitBySemiColon("un:deux:trois:quatre:cinq"),
                expectedResult,
            )
        })
    })

})