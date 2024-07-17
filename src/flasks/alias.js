const flask = require("../flask")
const fs = require("fs")

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

class alias extends flask
{
    constructor()
    {
        super()

        this.id = "alias"
        this.name = "Alias"
        this.description = `Aliases to native Javascript functions`
    }

    variables()
    {
        return {
            log,
            error,
            assert,
            exitCode,
            file
        }
    }
}

module.exports = new alias