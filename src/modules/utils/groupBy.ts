const map = (fn) => (arr) => arr.map(fn)

const reduce = (fn, arr, initialValue) => arr.reduce(fn, initialValue)

const keyDataReducer = (obj) => (acc, key, idx) => {
    return {
        ...acc,
        [key]: acc[key]
            ? [...acc[key], obj[idx]]
            : [obj[idx]],
    }
}

const groupBy = (fn) => {
    const keys = map(fn)
    return (obj) => {
        return reduce(
            keyDataReducer(obj),
            keys(obj),
            {}
        );
    }
}

export default groupBy;