import { describe, it } from 'node:test';
import assert from 'node:assert';

import add from "./";

describe('modules/add', () => {
    it('should add two number and return good result', () => {
        const result = add(7, 8);
        assert.equal(result, 15)
    })

    it('should add two number and return good result', () => {
        const result = add(5, 5);
        assert.equal(result, 10)
    })
});