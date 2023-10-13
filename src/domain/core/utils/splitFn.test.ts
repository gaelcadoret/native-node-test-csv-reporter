import { describe, it } from 'node:test'
import assert from 'assert'
import { splitFn } from '~/domain/core/utils/splitFn'

describe('splitFn', () => {
	it('should split a string by separator and return an array', () => {
		const data = 'occ,pearl,pulse'
		const splitByComma = splitFn(',')
		assert.deepEqual(splitByComma(data), ['occ', 'pearl', 'pulse'])
	})
})
