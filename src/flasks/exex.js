const flask = require("./flask")

class exex extends flask
{
    constructor()
    {
        super()

        this.id = "exex"
        this.name = "Expression extender"
        this.description = `Non-syntactic expression expansion: implicit stdin and anonymous function`
    }

    beforeEval(data)
    {
        /** @type {string} */
        let expression = data.expression

        let stdin = false
        let anonymous = false

        if(expression.startsWith("@"))
        {
            anonymous = true
            expression = expression.substring(1)
        }

        if(expression.startsWith("."))
        {
            stdin = true
            expression = expression.substring(1)
        }

        if(stdin)
        {
            expression = "stdin." + expression
        }

        if(anonymous)
        {
            expression = `(() => {${expression}})();`
        }

        data.expression = expression
        return data
    }
}

module.exports = new exex()