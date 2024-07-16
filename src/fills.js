const fs = require('fs')
const ss = require("./ss")

// /**
//  * Prints help
//  */
// const help = () => {
//     const ind = "    "
//     const message = [
//         "alchemist: help",
//         "",
//         "usage: alc <javascript expression> [// arg1 [arg2 ...]]",
//         ind + "expression - a valid Javascript expression or statement",
//         ind + "argX - an argument that will be available to the expression as 'args[X]'",
//         "",
//         "Evaluated value of the expression will be written to stdout",
//         "",
//         "available variables inside expression:",
//         ind + "args - an array with command line arguments",
//         ind + "stdin - a string containing data piped through standard input",
//         ind + "tstdin - a trimmed value of stdin",
//         "",
//         "example:",
//         ind + `alc "args[0] + args[1]" // 2 3`,
//         ind + ind + `Writes 5 to stdout`,
//         ""
//     ]

//     return message.join(LF)
// }

// help.toString = () => help()





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
        // CR,
        // LF,
        // CRLF,
        // EMPTY,
        // help,
        // log,
        // error,
        // assert,
        // exitCode,
        // file
    }
}