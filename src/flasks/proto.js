const flask = require("./flask")

class proto extends flask
{
    constructor()
    {
        super()

        this.id = "proto"
        this.name = "Prototype extensions"
        this.description = `Basic prototype extensions for objects`
    }

    load()
    {
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
    }
}

module.exports = new proto()