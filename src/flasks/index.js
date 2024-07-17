const flask = require("../flask")
const scopedEval = require("../scopedEval")

/** @type {flask[]} */
const availableFlasks = [
    require("./alc"),
    require("./base"),
    require("./alias"),
    require("./proto"),
    require("./exex"),
    require("./ss"),
    require("./dynflask")
]

const evaluate = (expression, alchemistVariables, flaskList) => {
    const flasks = fetchFlasks(flaskList)

    flasks.forEach(f => f.load())

    if(!alchemistVariables)
        alchemistVariables = {}

    alchemistVariables.usedFlasks = flasks

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

const fetchFlask = (flaskId) => {
    const flask = availableFlasks.find(f => f.id == flaskId)

    if(flask === undefined)
        throw `flask error: unknown flask ${flaskId}`

    return flask
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

    let dependencyOverflow = 10

    while(1)
    {
        if(dependencyOverflow < 1)
        {
            throw `flask error: dependency recursion limit reached`
        }

        dependencyOverflow--

        const deps = getMissingDependencies(flasks)

        if(deps.length == 0)
            break

        deps.forEach(entry => {
            const insertIdx = flasks.findIndex(f => f.id == entry.flask)

            const newFlasks = entry.missing.map(depId => fetchFlask(depId))

            flasks.splice(insertIdx, 0, ...newFlasks)
        })
    }

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

/**
 * Returns a list of missing dependencies per flask
 * @param {flask[]} flasks 
 */
const getMissingDependencies = (flasks) => {
    const ids = flasks.map(f => f.id)

    const requires = []

    flasks.forEach((f, fidx) => {
        const missing = []

        f.dependencies.forEach(depId => {
            const depIdx = ids.indexOf(depId)

            if(depIdx == -1)
            {
                missing.push(depId)
                return
            }

            if(depIdx <= fidx)
            {
                return
            }

            throw `flask error: ${f.id} requires ${depId}, which is fetched later`
        })

        if(missing.length > 0)
            requires.push({
                flask: f.id,
                missing
            })
    })

    return requires
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