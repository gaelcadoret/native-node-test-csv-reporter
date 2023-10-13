import { describe, it } from 'node:test'
import assert from 'assert'

import { isEmptyObj } from './isEmptyObj'

describe('isEmptyObj', () => {
	it('should return true if obj is empty', () => {
		assert.equal(isEmptyObj({}), true)
	})

	it('should return false if obj is not empty', () => {
		assert.equal(
			isEmptyObj({
				key: 'value',
			}),
			false
		)
	})
})
