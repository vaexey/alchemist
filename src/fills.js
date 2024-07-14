const fs = require('fs')
const ss = require("./ss")

/* Shortcut constants */
const CR = "\r"
const LF = "\n"
const CRLF = CR + LF
const EMPTY = ""

/**
 * Prints help
 */
const help = () => {
    const ind = "    "
    const message = [
        "alchemist: help",
        "",
        "usage: alc <javascript expression> [// arg1 [arg2 ...]]",
        ind + "expression - a valid Javascript expression or statement",
        ind + "argX - an argument that will be available to the expression as 'args[X]'",
        "",
        "Evaluated value of the expression will be written to stdout",
        "",
        "available variables inside expression:",
        ind + "args - an array with command line arguments",
        ind + "stdin - a string containing data piped through standard input",
        ind + "tstdin - a trimmed value of stdin",
        "",
        "example:",
        ind + `alc "args[0] + args[1]" // 2 3`,
        ind + ind + `Writes 5 to stdout`,
        ""
    ]

    return message.join(LF)
}

help.toString = () => help()

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
 * throws an exception with message when 'expected' value is not true
 * @param {boolean} expected must be === true to pass assertion
 * @param {string?} message optional message appended to exception
 * @param {object?} chain optional parameter that is returned when assertion is satisfied
 * @returns {object?} chain argument
 */
const assert = (expected, message, chain) => {
    if(expected === true)
        return chain

    throw `Alchemist assertion failed: ${message ?? 'no message provided'}`
}

/**
 * Sets the process.exitCode to `code` if set or `0` otherwise
 * @param {number?} code new code
 * @param {any?} chain optional parameter that is returned
 * @returns {number | any} chain object if not null, process.exitCode otherwise
 */
const exitCode = (code, chain) => {
    if(code === undefined)
        code = 0

    process.exitCode = code

    return chain ?? code
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
        EMPTY,
        help,
        log,
        error,
        assert,
        exitCode,
        file
    }
}