// Chanel reporter for SonarQube compatibility
import parseReport from '../parser'

export default async function* jsonReporter(source) {
	const report = await parseReport(source)
	yield JSON.stringify(report, null, 2)
}
