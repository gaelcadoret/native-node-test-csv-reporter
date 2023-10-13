const toString = (val) => Object.prototype.toString.call(val)

export const isEmptyObj = (value: Record<string, unknown>) =>
	toString(value) === '[object Object]' && JSON.stringify(value) === '{}'
