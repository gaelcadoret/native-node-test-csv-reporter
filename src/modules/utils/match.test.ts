import { describe, it } from 'node:test'
import assert from 'assert'
import match from './match'
// import { createHttpError } from '~/lib/utils'

describe('match', () => {
	// it('should throw error if foo property is missing', () => {
	// 	// Given
	// 	const data = {
	// 		bar: 'bar',
	// 	}
	// 	const isMissingFoo = (data) => !Object.hasOwn(data, 'foo')
	//
	// 	// When / Then
	// 	assert.throws(() => {
	// 		match(data)
	// 			.when(isMissingFoo, () => {
	// 				// createHttpError(400, 'Property foo is missing')
	// 			})
	// 			.when(
	// 				() => true,
	// 				() => "Header's object is well formated"
	// 			)
	// 			.execute()
	// 	}, new Error('Property foo is missing'))
	// })

	it('should not throw error if foo property is defined', () => {
		// Given
		const data = {
			foo: 'foo',
			bar: 'bar',
		}
		const isMissingFoo = (data) => !Object.hasOwn(data, 'foo')

		// When / Then
		assert.doesNotThrow(() => {
			const result = match(data)
				.when(isMissingFoo, () => {
					// createHttpError(400, 'Property foo is missing')
				})
				.when(
					() => true,
					() => 'Object is well formated'
				)
				.execute()

			assert.equal(result, 'Object is well formated')
		}, undefined)
	})

	it('should return value for first matching condition', () => {
		// Given
		const data = {
			foo: 'foo',
			bar: 'bar',
		}

		// When
		const result = match(data)
			.with('foo', () => 'foo')
			.with('bar', () => 'bar')
			.execute()

		// Then
		assert.equal(result, 'foo')
	})

	it('should throw error if no pattern were found', () => {
		// Given
		const userData = {
			firstName: 'Bob',
			lastName: 'Dupont',
		}
		const isMissingFirstName = (data) => !Object.hasOwn(data, 'firstName')
		const isMissingLastName = (data) => !Object.hasOwn(data, 'lastName')

		// When / Then
		assert.throws(() => {
			match(userData)
				.when(isMissingFirstName, () => {
					// createHttpError(400, 'Property firstName is missing')
				})
				.when(isMissingLastName, () => {
					// createHttpError(400, 'Property lastName is missing')
				})
				.execute()
		}, new Error('Pattern not found for {"firstName":"Bob","lastName":"Dupont"}'))
	})

	it('should return message for first match', () => {
		// Given
		type User = {
			firstName: string
			lastName: string
			address: {
				street: string
				city: string
				zipCode: string
			}
		}
		const userData: User = {
			firstName: 'Bob',
			lastName: 'Dupont',
			address: {
				street: 'rue de la paix',
				city: 'Paris',
				zipCode: '75000',
			},
		}

		// When
		const result = match<User>(userData)
			.with('address.street', () => 'address.street match')
			.with('address.city', () => 'address.city match')
			.execute()

		// Then
		assert.equal(result, 'address.street match')
	})

	it('simple pattern matching without chaining methods', () => {
		// Given
		type User = {
			firstName: string
			lastName: string
			address: {
				street: string
				city: string
				zipCode: string
			}
		}
		const userData: User = {
			firstName: 'Bob',
			lastName: 'Dupont',
			address: {
				street: 'rue de la paix',
				city: 'Paris',
				zipCode: '75000',
			},
		}
		const patterns = [
			{
				pattern: 'address.street',
				action: () => 'address.street match',
			},
			{
				pattern: 'address.city',
				action: () => 'address.city match',
			},
		]

		// When
		const result = match<User>(userData, patterns).execute()

		// Then
		assert.equal(result, 'address.street match')
	})

	it('simple expression pattern matching without chaining methods', () => {
		// Given
		type User = {
			firstName: string
			lastName: string
			address: {
				street: string
				city: string
				zipCode: string
			}
		}
		const userData: User = {
			firstName: 'Bob',
			lastName: 'Dupont',
			address: {
				street: 'rue de la paix',
				city: 'Paris',
				zipCode: '75000',
			},
		}
		const patterns = [
			{
				pattern: (o: User) => o?.address?.street && 'address.street',
				action: () => 'address.street match',
			},
			{
				pattern: (o: User) => o?.address?.city && 'address.city',
				action: () => 'address.city match',
			},
		]

		// When
		const result = match<User>(userData, patterns).execute()

		// Then
		assert.equal(result, 'address.street match')
	})
})
