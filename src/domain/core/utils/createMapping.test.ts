import { describe, it } from 'node:test'
import assert from 'node:assert'

import { createMapping } from './createMapping'

describe('createMapping', () => {
	it('should create a mapping and get value by key', () => {
		const marketData = [
			{
				market: 'Australia',
				prefix: 'au',
				store: 'chanel_au_ecom',
			},
			{
				market: 'Belgium',
				prefix: 'be-fr',
				store: 'chanel_be',
			},
		]

		const getValueFromMapping = createMapping(marketData, 'prefix', 'store')

		assert.equal(getValueFromMapping('au'), 'chanel_au_ecom')
	})

	it("should return an undefined when mappingKey doesn't exist", () => {
		const marketData = [
			{
				market: 'Australia',
				prefix: 'au',
				store: 'chanel_au_ecom',
			},
			{
				market: 'Belgium',
				prefix: 'be-fr',
				store: 'chanel_be',
			},
		]

		const getValueFromMapping = createMapping(marketData, 'prefix', 'store')
		assert.equal(getValueFromMapping('en'), undefined)
	})

	it("should return an error when key or value doesn't exist", () => {
		const marketData = [
			{
				market: 'Australia',
				prefix: 'au',
				store: 'chanel_au_ecom',
			},
			{
				market: 'Belgium',
				prefix: 'be-fr',
				store: 'chanel_be',
			},
		]

		assert.throws(
			// @ts-ignore
			createMapping(marketData, 'prefixe', 'stor'),
			new Error('Invalid key: "prefixe" or value: "stor" for mapping')
		)
	})
})
