const flask = require("./flask")
const scopedEval = require("./scopedEval")

/** @type {flask[]} */
const availableFlasks = [
    require("./base"),
    require("./alias"),
    require("./proto"),
    require("./exex"),
    require("./ss"),
]

const evaluate = (expression, alchemistVariables, flaskList) => {
    const flasks = fetchFlasks(flaskList)

    flasks.forEach(f => f.load())

    if(!alchemistVariables)
        alchemistVariables = {}

    let data = {
        expression,
        variables: {
            alchemist: alchemistVariables
        }    
    }

    flasks.forEach(f => data = f.beforeVariables(data))
    flasks.forEach(f => mergeVariables(data.variables, f.variables()))
    flasks.forEach(f => data = f.beforeEval(data))

    const result = scopedEval(data.expression, data.variables)

    data.result = result

    flasks.forEach(f => data = f.afterEval(data))

    return data.result
}

/**
 * Returns subset of available flasks with specified
 * order and ids. Duplicated or nonexistent ids throw an error
 * @param {string[]} flaskList id array
 * @returns {flask[]}
 */
const fetchFlasks = (flaskList) => {
    if(flaskList[0] == '*')
    {
        if(flaskList.length != 1)
            throw 'flask error: when fetching all flasks, the * specifier must be the only flask id on the list'

        return availableFlasks
    }
    const flasks = flaskList.map(id => availableFlasks.find(f => f.id == id))

    if(flasks.includes(undefined))
        throw `flask error: unknown flasks ${flasks.map((f,i) => f ? null : flaskList[i]).filter(s => s)}`

    const duplicates = flaskList.map(a => flaskList.findIndex(b => a === b)).filter((di, ci) => di != ci)

    if(duplicates.length != 0)
        throw `flask error: duplicate flasks ${duplicates.map(i => flaskList[i])}`


    // Check conflicts
    const conflicts = getFlaskConflicts(flasks)

    if(conflicts.length > 0)
        throw `flask error: conflicting flasks: ${conflicts}`

    return flasks
}

/**
 * Returns a list of conflicting flasks
 * in specified array (if any)
 * @param {flask[]} flasks 
 */
const getFlaskConflicts = (flasks) => {
    const ids = flasks.map(f => f.id)

    const conflicts = []

    flasks.forEach(f => {
        const cids = f.conflicts.filter(cid => ids.includes(cid))

        if(cids.length > 0)
            conflicts.push({
                flask: f.id,
                with: cids
            })
    })

    return conflicts
}

const mergeVariables = (target, source) => {
    if(Array.isArray(source))
    {
        let newSource = {}

        source.forEach(kvp => {
            newSource[kvp.name] = kvp.value
        })

        source = newSource
    }

    const existing = Object.keys(target)
    
    Object.keys(source).forEach(key => {
        if(existing.includes(key))
        {
            throw `flask error: redefinition of variable '${key}'`
        }

        target[key] = source[key]
    })

}

module.exports = {
    flask,
    flasks: availableFlasks,
    evaluate,
    fetchFlasks,
    getFlaskConflicts,
    mergeVariables
}