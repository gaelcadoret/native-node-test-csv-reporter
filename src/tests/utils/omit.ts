export const omit = (obj: any, fields: string[]) =>
	Object.entries(obj).reduce((acc, [key, val]) => {
		if (fields.includes(key)) {
			return {
				...acc,
			}
		}

		return {
			...acc,
			[key]: val,
		}
	}, {})
