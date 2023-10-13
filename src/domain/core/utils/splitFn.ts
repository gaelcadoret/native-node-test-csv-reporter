type SplitFn = (separator: string) => (str: string) => string[]
export const splitFn: SplitFn = (separator) => (str) => str.split(separator)
