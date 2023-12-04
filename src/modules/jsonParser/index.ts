

const startsWith = (char) => (str) => str.toString().startsWith(char)
const startsWithAlias = startsWith('@');
const startsWithJsonPath = startsWith('$.');
const isObject = (val) => !Array.isArray(val) && typeof val === 'object'
const isArray = (val) => Array.isArray(val)
const mapAndParse = (val, lvl) => val.map((el, idx) => jsonParser(el, lvl, idx))
const split = (separator) => (str) => str.split(separator);
const splitByColon = split(":");
const extractResourceAndId = (val) => splitByColon(val)
const contextReducer = (acc, [key, val]) => ({
    ...acc,
    [key]: val
})
const extractContext = (val) => {
    return Object.entries(val).reduce(contextReducer, {})
}
const getResourceContext = (resource) => {
    const context = mContext.get('config')
    return context
        ? context[resource]
        : undefined;
}

const mContext = new Map([['config', null]]);

const parseLevelReducer = (lvl, arrayIdx) => (acc, [key, val]) => {
    if (arrayIdx != null) console.log(`%c arrayIdx %c => ${arrayIdx}`, 'background-color:#f2b7b3;font-weight:bold;color:white;', 'background-color:white;color:gray;font-style:italic;')

    console.log('key', key);
    console.log('val', val);

    // manage jsonPath
    if (startsWithJsonPath(val)) {
        console.log(`%c find jsonPath %c => ${val}`, 'background-color:orange;font-weight:bold;color:white;', 'background-color:white;color:gray;font-style:italic;')
    }

    // manage alias in key
    if (startsWithAlias(key)) {
        console.log(`%c find alias (key) %c => ${key}`, 'background-color:lightblue;font-weight:bold;color:white;', 'background-color:white;color:gray;font-style:italic;')
        console.log('val', val)

        if (key === "@context") {
            console.log(`%c find alias (key) @context %c => ${key}`, 'background-color:lightblue;font-weight:bold;color:white;', 'background-color:white;color:gray;font-style:italic;')
            const context = extractContext(val)
            mContext.set('config', context);
        }

        if (key === "@id") {
            console.log(`%c find alias (key) @id %c => ${key}`, 'background-color:lightblue;font-weight:bold;color:white;', 'background-color:white;color:gray;font-style:italic;')
            const [resource, id] = extractResourceAndId(val)
            const context = getResourceContext(resource);
            console.log(`Fetch /${resource}/${id} with the context => ${JSON.stringify(context, null, 2)}.`)
        }
    }

    // manage alias in value
    if (startsWithAlias(val)) {
        console.log(`%c find alias (val) %c => ${val}`, 'background-color:lightblue;font-weight:bold;color:white;', 'background-color:white;color:gray;font-style:italic;')
        console.log('acc', acc)
    }

    // manage arrays
    if (isArray(val)) {
        console.log(`%c find array %c => ${key}`, 'background-color:yellow;font-weight:bold;color:#333333;', 'background-color:white;color:gray;font-style:italic;')
        return {
            ...acc,
            [key]: mapAndParse(val, lvl + 1),
        }
    }

    // manage objects
    if (isObject(val)) {
        console.log(`%c find object %c => ${key}`, 'background-color:lightgreen;font-weight:bold;color:#333333;', 'background-color:white;color:gray;font-style:italic;')

        return {
            ...acc,
            [key]: jsonParser(val, lvl + 1),
        }
    }

    return {
        ...acc,
        [key]: val,
    }
}

const jsonParser = (obj, lvl = 0, arrayIdx = null) => {
    console.log('%clvl => %c ' + lvl + " ", 'color: gray', 'background-color:#00CC00;color:white')
    return Object.entries(obj).reduce(parseLevelReducer(lvl, arrayIdx), {});
}

export default jsonParser
