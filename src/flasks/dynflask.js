const flask = require("../flask")

class dynflask extends flask
{
    constructor()
    {
        super()

        this.id = "dynflask"
        this.name = "dynflask"
        this.description = `Flask manager for alchemist`

        this.alchemist = null
    }

    beforeVariables(data)
    {
        this.alchemist = data.variables.alchemist

        return data
    }

    variables()
    {
        const flasks = {
            list: () => {

                const available = this.alchemist.availableFlasks
                const usedIds = this.alchemist.usedFlasks.map(f => f.id)

                return `dynflask: Available flasks:\n` +
                    available.map(f =>
                        (usedIds.includes(f.id) ? ` [x] ` : ` [ ] `) +
                        `${f.id} (${f.switch ?? '-'}), ${f.name} - ${f.description}`
                    ).join("\n")
                    + "\n"
            },

            help: () => {
                return [
                    "dynflask: Flask manager",
                    "Available commands:",
                    "  flasks.list() - lists used and unused flasks",
                    ""
                ].join("\n")
            }
        }

        flasks.list.toString = flasks.list
        flasks.help.toString = flasks.help
        flasks.toString = flasks.help

        return {
            flasks,
            flask: flasks
        }
    }
}

module.exports = new dynflask()