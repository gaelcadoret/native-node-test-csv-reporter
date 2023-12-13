
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

    const map = (fn) => (arr) => arr.map(fn)
    const entries = (obj) => Object.entries(obj)
    const reduce = (fn, arr, initialValue) => arr.reduce(fn, initialValue)

    const keyDataReducer = (obj) => (acc, key, idx) => {
        return {
            ...acc,
            [key]: acc[key]
                ? [...acc[key], obj[idx]]
                : [obj[idx]],
        }
    }

    // keys(obj) // ['barbarians', 'barbarians', 'swordmasters', 'knights', 'barbarians', 'warlords']
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

    const groupByStrength = groupBy((character) => {
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

    const createClassification = R.pipe(
        entries, // R.toPairs is equivalent to Object.entries
        groupByStrength,
    )

    console.log(createClassification(charactersStrength))
