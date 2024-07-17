/**
 * A container for Javascript extensions that
 * are provided for alchemist expressions
 */
class flask
{
    constructor()
    {
        /** @type {string} Flask id/short name */
        this.id = null

        /** @type {string} Flask single character identifier */
        this.switch = null

        /** @type {string} Flask friendly name */
        this.name = "Unnamed flask"

        /** @type {string} Flask description */
        this.description = "No description."

        /** @type {string[]} Flask dependencies ids */
        this.dependencies = []

        /** @type {string[]} Flask ids conflicting with this flask */
        this.conflicts = []
    }

    /**
     * Method called after a flask is loaded  
     * A place to put extensions, eg.
     * `Object.defineProperty`
     */
    load()
    { }

    /**
     * Generates variables that are avaliable to the expression,
     * eg. `return { LF: '\n' };` will make `LF` available in the expression.
     * @returns {{name: string, value: any?}[] | {[key: string]: any?}}
     */
    variables()
    {
        return []
    }

    /**
     * Returns a list of variable names that are provided by this flask.
     * Usually does not need to be overloaded unless a variable must be
     * hidden. This function is used puerly to print flask info to the user.
     * @returns {string[]}
     */
    provides()
    {
        const variables = this.variables()

        if(Array.isArray(variables))
        {
            return variables.map(kvp => key)
        }

        return Object.keys(variables)
    }


    /**
     * Function called on flask before variables from flasks are generated.
     * Contains expression string and variable dictionary.
     * The returned value overwrites received `data` object.
     * @param {{expression: string, variables: {}}} data 
     * @returns 
     */
    beforeVariables(data)
    {
        return data
    }

    /**
     * Function called on flask before an expression is evaluated.
     * Contains expression string and variable dictionary.
     * The returned value overwrites received `data` object.
     * @param {{expression: string, variables: {}}} data 
     * @returns 
     */
    beforeEval(data)
    {
        return data
    }

    /**
     * Function called on flask after an expression was evaluated.
     * Contains expression string, variable dictionary and expression result.
     * The returned value overwrites received `data` object.
     * @param {{expression: string, variables: {}, result: any?}} data 
     * @returns 
     */
    afterEval(data)
    {
        return data
    }

    toString()
    {
        const id = this.id
        const name = this.name

        return JSON.stringify({
            id,
            name
        })
        // return JSON.stringify(this)
    }
}

module.exports = flask