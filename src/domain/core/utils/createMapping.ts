export const createMapping =
	(data: Record<string, any>[], key: string, value: string) =>
	(mappingKey: string) => {
		const mapping = data.reduce((acc, currentValue) => {
			if (!currentValue[key] || !currentValue[value]) {
				throw new Error(
					`Invalid key: "${key}" or value: "${value}" for mapping`
				)
			}

			return {
				...acc,
				[currentValue[key]]: currentValue[value],
			}
		}, {})

		if (!mapping[mappingKey]) {
			return undefined
		}

		return mapping[mappingKey]
	}
