const flasks = require("./flasks")
const config = require("./config")

/**
 * Evaluates an alchemist expression
 * @param {string} expression alchemist expression
 * @param {string} data data passed to the expression (eg. stdin)
 * @returns {string} evaluated value
 */
const alchemist = (expression, data) => {
    config.read()

    const args = extractArgs(expression)

    expression = args.shift()

    const variables = {
        stdin: data,
        tstdin: data.trim(),
        args,
        availableFlasks: flasks.flasks,
        config
    }

    const result = flasks.evaluate(
        expression, 
        variables,
        config.flasks
    )

    if(result === undefined)
        return ""
    if(result === null)
        return "null"

    return result + ""
}

/**
 * Extracts arguments from an alchemist expression
 * @param {string} expression alchemist expression
 * @returns {string[]} args array
 */
const extractArgs = (expression) => {
    let sanitized = ""

    const quotes = `'"\``
    const stack = []
    let escape = false
    expression
        .split('')
        .forEach(ch => {
            if(stack.length > 0)
            {
                if(stack[0] === ch && !escape)
                {
                    stack.shift()
                }

                escape = (ch === '\\')

                return
            }

            if(!escape && quotes.includes(ch))
            {
                stack.unshift(ch)
                
                return
            }

            escape = (ch === '\\')

            sanitized += ch
        })
    
    const argIndex = sanitized.indexOf("//")
    if(argIndex === -1)
        return [expression]

    return [
        expression.substring(0, expression.length - sanitized.length + argIndex),
        ...sanitized.substring(argIndex + 2).trim().split(" ")
    ]
}

module.exports = alchemist
module.exports.extractArgs = extractArgs