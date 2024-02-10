import { Match, When, WithPattern } from './match.types'

/**
 * This is a simple pattern matching library for JavaScript.
 * It allows you to match objects against patterns and execute actions based on the matched pattern.
 *
 * Here is an example of use for "with" method:
 *  const data = {
 * 		foo: 'foo',
 * 		bar: {
 * 		 baz: 'baz',
 * 		}
 * 	}
 *  const result = match(obj)
 *    .with('bar.baz', () => 'baz')
 *    .execute()
 *
 * instead of:
 *
 * if (obj.foo) {
 *   return 'bar'
 * } else if (obj.bar) {
 *   return 'foo'
 * } else {
 *   throw new Error(`Pattern not found for ${JSON.stringify(obj)}`)
 * }
 *
 * The when method is a more flexible way. Instead of matching a property, you can match any expression.
 * Example of use for "when" method:
 * 		const data = {
 * 			foo: 'foo',
 * 			bar: 'bar',
 * 			baz: 'baz',
 * 		}
 * 		const isMissingFoo = (data) => !Object.hasOwn(data, 'foo')
 * 		const isMissingBar = (data) => !Object.hasOwn(data, 'bar')
 *
 *    const result = match(data)
 *       .when(isMissingFoo, () => {
 *          throw new Error('Property foo is missing')
 *       })
 *       .when(isMissingBar, () => {
 *          throw new Error('Property bar is missing')
 *       })
 *       .when(
 *          () => true,
 *          () => 'Object is well formated'
 *       )
 *       .execute()
 *
 * @param obj
 * @param patterns - array of patterns to match (empty by default)
 */
const match: Match = (obj, patterns = []) => {
	const execute = () => {
		const matchedPattern = patterns.find(({ pattern }) =>
			matchPattern(obj, pattern)
		)

		if (matchedPattern) {
			return matchedPattern.action()
		} else {
			throw new Error(`Pattern not found for ${JSON.stringify(obj)}`)
		}
	}

	/**
	 * @param {string} pattern - property or path (comma separated) to match
	 * @param {function} action - the function to execute if the pattern matches
	 * @returns {any} - recursive call in order to chain methods
	 */
	const withPattern: WithPattern = (pattern, action) => {
		const newPatterns = patterns.concat({ pattern, action })
		return match(obj, newPatterns)
	}

	/**
	 * @param {function} expression - the function to execute as pattern matcher
	 * @param {function} action - the function to execute if the pattern matches
	 * @returns {any} - recursive call in order to chain methods
	 */
	const when: When = (expression, action) => {
		const newPatterns = patterns.concat({ pattern: expression, action })
		return match(obj, newPatterns)
	}

	const matchPattern = (obj, pattern) => {
		if (typeof pattern === 'function') {
			return pattern(obj)
		}

		const keys = pattern.split('.')
		return (
			keys.reduce(
				(acc, key) => (acc && acc[key] ? acc[key] : undefined),
				obj
			) !== undefined
		)
	}

	return { with: withPattern, execute, when }
}

export default match
