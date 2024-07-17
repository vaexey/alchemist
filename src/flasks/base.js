const flask = require("../flask")

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

class base extends flask
{
    constructor()
    {
        super()

        this.id = "base"
        this.name = "Base"
        this.description = `Base alchemist flask`
    }

    variables()
    {
        return {
            CR,
            LF,
            CRLF,
            EMPTY,
            help
        }
    }

    beforeVariables(data)
    {
        const variables = data.variables

        Object.keys(variables.alchemist).forEach(key => {
            variables[key] = variables.alchemist[key]
        })

        return data
    }
}

module.exports = new base()