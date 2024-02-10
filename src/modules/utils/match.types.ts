export type Match = <T>(obj: T, patterns?: any[]) => any
export type WithPattern = (pattern: string, action: () => any) => Match
export type When = (
	expression: (headers: HeadersInit) => boolean,
	action: () => unknown
) => Match
