const map = (fn: Function) => <T>(arr: T[]): T[] => arr.map(fn)

type Universal = string | number | object | undefined
const reduce = <T>(fn: Function, arr: T[], initialValue: Universal) => arr.reduce(fn, initialValue)

const keyDataReducer = (obj) => (acc, key, idx) => {
    return {
        ...acc,
        [key]: acc[key]
            ? [...acc[key], obj[idx]]
            : [obj[idx]],
    }
}

const groupBy = (fn: Function) => {
    const keys = map<string>(fn)
    return (obj) => {
        return reduce(
            keyDataReducer(obj),
            keys(obj),
            {}
        );
    }
}

export default groupBy;