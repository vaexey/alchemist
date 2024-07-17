const flask = require("../flask")

class alc extends flask
{
    constructor()
    {
        super()

        this.id = "alc"
        this.name = "Default collection"
        this.description = `Default alchemist flask collection`

        this.dependencies = [
            "base",
            "exex",
            "alias",
            "proto",
            "ss",
            "dynflask"
        ]
    }
}

module.exports = new alc()