import {pipe} from "ramda";
import {groupBy} from "./modules/utils";

const charactersStrength = {
    perso_1: 3,
    perso_2: 25,
    perso_3: 87,
    perso_4: 117,
    perso_5: 12,
    perso_6: 152,
}

// const groupByStrength = R.groupBy(([character, strength]) => {
//     return R.lte(strength, 50) ? 'barbarians' :
//         R.lte(strength, 100) ? 'swordmasters' :
//         R.lte(strength, 150) ? 'knights' : 'warlords'
// })
// const log = (data) => {
//     console.log(data)
//     return data;
// }
// const initGroup = (character) => [character]
// const mergeBarbarians = (acc, character) => [...acc['barbarians'], character]
// const mergeSwordmasters = (acc, character) => [...acc['swordmasters'], character]
// const mergeKnights = (acc, character) => [...acc['knights'], character]
// const mergeWarlords = (acc, character) => [...acc['warlords'], character]
// const mergeGroupByGroupName = (groupName) =>
//     (acc, character) =>
//         [...acc[groupName], character]
// const mergeBarbarians = mergeGroupByGroupName('barbarians')
// const mergeSwordmasters = mergeGroupByGroupName('swordmasters')
// const mergeKnights = mergeGroupByGroupName('knights')
// const mergeWarlords = mergeGroupByGroupName('warlords')
// const addBarbarians = (acc, character) => ({
//     'barbarians': acc.barbarians
//         ? mergeBarbarians(acc, character)
//         : initGroup(character),
// })
// const addSwordmasters = (acc, character) => ({
//     'swordmasters': acc.swordmasters
//         ? mergeSwordmasters(acc, character)
//         : initGroup(character),
// })
// const addKnights = (acc, character) => ({
//     'knights': acc.knights
//         ? mergeKnights(acc, character)
//         : initGroup(character),
// })
// const addWarlords = (acc, character) => ({
//     'warlords': acc.warlords
//         ? mergeWarlords(acc, character)
//         : initGroup(character),
// })
// const manageBarbarians = (acc, character) => ({
//     ...acc,
//     ...addBarbarians(acc, character)
// })
// const manageSwordmasters = (acc, character) => ({
//     ...acc,
//     ...addSwordmasters(acc, character)
// })
// const manageKnights = (acc, character) => ({
//     ...acc,
//     ...addKnights(acc, character)
// })
// const manageWarlords = (acc, character) => ({
//     ...acc,
//     ...addWarlords(acc, character)
// })
// const manageBarbarians = manageGroups('barbarians')
// const manageSwordmasters = manageGroups('swordmasters')
// const manageKnights = manageGroups('knights')
// const manageWarlords = manageGroups('warlords')
// const classificationReducer = (acc, character) => {
//         const [characterName, strength] = character;
//         if (strength <= 50) {
//             return manageBarbarians(acc, character)
//             // return 'barbarians'
//         }
//         if (strength <= 100) {
//             return manageSwordmasters(acc, character)
//         }
//         if (strength <= 150) {
//             return manageKnights(acc, character)
//         }
//         return manageWarlords(acc, character);
//     }
// const map = (fn) => (arr) => Array.isArray(arr)
//     ? arr.map(fn)
//     : Object.entries(arr).map(fn);
// const groupByKey = (key) => (acc, data) => {
//     return {
//         ...acc,
//         [key]: acc[key]
//             ? [...acc[key], data]
//             : [data],
//         }
// }

const entries = (obj) => Object.entries(obj)

const groupByStrength = groupBy((character: [string, number]) => {
    const [characterName, strength] = character;

    if (strength <= 50) {
        return 'barbarians'
    }
    if (strength <= 100) {
        return 'swordmasters'
    }
    if (strength <= 150) {
        return 'knights'
    }
    return 'warlords'
})
const log = (data) => {
    console.log('data', data)
    return data;
}
const createClassification = pipe(
    entries, // R.toPairs is equivalent to Object.entries
    log,
    groupByStrength,
)
// const result1 = createClassification(charactersStrength)
// console.log('result1', result1)


const cars = [
    {
        brand: 'suzuki',
        model: 'swift',
        color: 'red',
        power: 100,
        maxSpeed: 170,
        motor: 'diesel',
    },
    {
        brand: 'suzuki',
        color: 'blue',
        model: 'swift',
        power: 120,
        maxSpeed: 190,
        motor: 'essence',
    },
    {
        brand: 'suzuki',
        color: 'green',
        model: 'swift',
        power: 140,
        maxSpeed: 200,
        motor: 'essence',
    },
    {
        brand: 'toyota',
        color: 'red',
        model: 'yaris',
        power: 100,
        maxSpeed: 170,
        motor: 'essence',
    },
    {
        brand: 'toyota',
        color: 'blue',
        model: 'yaris',
        power: 120,
        maxSpeed: 185,
        motor: 'essence',
    },
    {
        brand: 'toyota',
        color: 'green',
        model: 'yaris',
        power: 140,
        maxSpeed: 195,
        motor: 'essence',
    },
    {
        brand: 'honda',
        color: 'red',
        model: 'civic 8 TDI',
        power: 140,
        maxSpeed: 200,
        motor: 'diesel',
    },
    {
        brand: 'honda',
        color: 'blue',
        model: 'civic 8 sport',
        power: 150,
        maxSpeed: 210,
        motor: 'essence',
    },
    {
        brand: 'honda',
        color: 'green',
        model: 'civic 8 sport',
        power: 170,
        maxSpeed: 215,
        motor: 'essence',
    },
]

const groupByBrand = groupBy((car) => car.brand)
// const createClassificationByPower = groupBy((car) => {
//     const {power} = car;
//     if (power <= 100) {
//         return 'low'
//     }
//     if (power <= 120) {
//         return 'medium'
//     }
//     return 'high'
// })
// const result = createClassificationByPower(cars)
// console.log('result', result);

const map = (fn: Function) => <T>(arr: T[]): T[] => arr.map(fn)
type User = {
    name: string;
    age: number;
}
type Users = User[]
const users: Users = [
    {
        name: 'John',
        age: 20,
    },
    {
        name: 'Jane',
        age: 20,
    },
    {
        name: 'Fred',
        age: 30,
    },
    {
        name: 'Bob',
        age: 30,
    },
    {
        name: 'Alice',
        age: 40,
    },
    {
        name: 'Dora',
        age: 40,
    },
]

const test = map((user) => user.name)
const result2 = test<string>(users)
console.log('test', result2.map((name) => name.toUpperCase()))
