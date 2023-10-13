import { describe, it } from 'node:test'

import { getValueBySymbolName } from './getValueBySymbolName'
import assert from 'assert'

describe('getValueBySymbolName', () => {
	it('should return the value from the given symbol', () => {
		const data = {
			name: 'value',
			[Symbol('example')]: {
				example: 'example',
			},
		}

		const symbolName = getValueBySymbolName('example')
		assert.deepEqual(symbolName(data), { example: 'example' })
	})
})
