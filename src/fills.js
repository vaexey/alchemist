const fs = require('fs')

/* Shortcut constants */
const CR = "\r"
const LF = "\n"
const CRLF = CR + LF

/**
 * console.log wrapper
 * @param  {...any} args 
 */
const log = (...args) => {
    return console.log.call(console, ...args)
}

/**
 * console.error wrapper that exits alchemist
 * @param  {...any} args 
 */
const error = (...args) => {
    console.error.call(console, ...args)

    throw `Alchemist exception: ${args[0] ?? 'error was called'}`
}

/**
 * JSON.parse wrapper
 * @param {object?} reviver ref. JSON.parse
 */
Object.prototype.json = function(reviver) {
    return JSON.parse(this + "", reviver)
}

/**
 * JSON.stringify wrapper with pretty print option
 * @param {boolean?} pretty pretty print output
 * @returns {string} JSON string
 */
Object.prototype.toJson = function(pretty) {
    if(pretty === undefined)
        pretty = false

    return JSON.stringify(this, null, pretty ? 4 : null)
}

/**
 * fs.writeFileSync wrapper
 * @param {fs.PathOrFileDescriptor} path
 * @param {fs.WriteFileOptions?} options
 * @returns {object?} this object or null if write throws an error
 */
Object.prototype.toFile = function(path, options) {
    try {
        fs.writeFileSync(path, this + "", options)

        return this
    } catch (error) {
        return null
    }
}

/**
 * fs.readFileSync wrapper
 * @param {fs.PathOrFileDescriptor} path
 * @param {object?} options
 * @returns {string?} contents
 */
const file = (path, options) => {
    try {
        return fs.readFileSync(path, options).toString()
    } catch (error) {
        return null
    }
}

/**
 * Evaluates Javascript code in fills scope
 * @param {string} expression 
 * @param {Map<string, any>?} variables
 * @returns {any}
 */
const evaluate = (expression, variables) => {
    if(!variables)
        variables = {}

    return eval(
        Object.keys(variables).map(
            name => `var ${name} = variables.${name};`
        ).join("") +
        expression
    )
}

module.exports = {
    evaluate,
    inner: {
        CR,
        LF,
        CRLF,
        log,
        file
    }
}