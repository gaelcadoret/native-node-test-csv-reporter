import { describe, it } from 'node:test';
import assert from 'node:assert';

import add from "./";

describe('add', () => {
    it('should add', () => {
        const result = add(7, 8);
        assert.equal(result, 15)
    })
});