import {
	EVENT_TEST_START,
	EVENT_TEST_PASS,
	EVENT_TEST_FAIL,
	EVENT_TEST_DIAGNOSTIC,
	ERROR_CODE_TEST_FAILURE,
	EVENT_TEST_COVERAGE
} from '../constants'

export default async function parseReport(source) {
	const tests = [];
	for await (const event of source) {
		switch (event.type) {
			case 'test:start':
				// yield `test ${event.data.name} started\n`
				tests.push(event)
				break
			case 'test:pass':
				// yield `test ${event.data.name} passed\n`
				tests.push(event)
				break
			case 'test:fail':
				// yield `test ${event.data.name} failed\n`
				tests.push(event)
				break
			// case EVENT_TEST_COVERAGE:
			// 	tests.push(event)
			// 	break
			default:
				tests.push(event)
			// 	yield `default event received: ${JSON.stringify(event)}`
		}
	}

	return {
		tests,
		duration: 0,
	}
}
