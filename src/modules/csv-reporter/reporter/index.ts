// Chanel reporter for SonarQube compatibility
// import parseReport from '../parser'
import parseReport from 'node-test-parser'

type TestError = {
	failureType: string
	cause: string
	generatedMessage: boolean
	code: string
	actual: unknown
	expected: unknown
	operator: string
}

type childTest = {
	name: string
	file: string
	tests: Record<string, unknown>[]
	duration: number
	skip: boolean
	todo: boolean
	failure?: unknown
}

type RootTest = {
	name: string
	file: string
	tests: Record<string, childTest>[]
	skip: boolean
	todo: boolean
	duration: number
	error?: TestError
}

async function* csvReporter(source) {
	const report = await parseReport(source)
	const { duration, tests } = report;

	const successFilter = ({error, failure, skip}: { error?: TestError, failure?: unknown, skip: boolean }) => !error && !failure && !skip
	const failedFilter = ({error, failure}: { error?: TestError, failure?: unknown }) => error || failure
	const skipFilter = ({skip}: { skip: boolean }) => skip

	const getNbSuccessTests = (tests: RootTest[]): number => tests.filter(successFilter).length
	const getNbFailedTests = (tests: RootTest[]): number => tests.filter(failedFilter).length
	const getNbSkipTests = (tests: RootTest[]): number => tests.filter(skipFilter).length

	const results = new Map()
	results.set('pass', getNbSuccessTests(tests))
	results.set('fail', getNbFailedTests(tests))
	results.set('skip', getNbSkipTests(tests))
	results.set('duration', parseInt(report.duration, 10))

	console.table(results);
	console.log('duration', duration, "ms")

	yield ''
	// yield JSON.stringify(report, null, 2)
}

import { Transform } from 'node:stream'



export default csvReporter