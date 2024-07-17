const flask = require("../flask")
const alias = require("./alias")
const assert = alias.variables().assert

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

        /**
         * Calls isNaN method on this object
         * @returns {boolean}
         */
        Object.prototype.isNaN = function() {
            return isNaN(this)
        }

        /**
         * Converts number from base specified by 
         * radix (default: 16) to base 10 number object
         * @param {number?} radix 
         * @returns {number?} null if not successfull
         */
        Object.prototype.fromBase = function(radix) {
            const num = parseInt(this + "", radix ?? 16)

            if(isNaN(num))
                return null

            return num
        }

        /**
         * Converts number from base 10 to base specified by 
         * radix (default: 16)
         * @param {number?} radix 
         * @returns {string | number | null} null if not successfull
         */
        Object.prototype.toBase = function(radix) {
            const num = +this

            if(isNaN(num))
                return null

            radix = radix ?? 16

            let string = num.toString(radix)

            if(radix < 11)
                string = +string

            return string
        }

        /**
         * Calls the alias `assert` on this object as `chain`
         * with the `delegate` function
         * @param {(this: object) => boolean} delegate 
         * @param {string?} message 
         */
        Object.prototype.assert = function(delegate, message) {
            return assert(delegate(this), message, this)
        }

        /**
         * Calls the alias `assert` on this object as `chain`
         * asserting that `this == expected`
         * @param {object?} expected 
         * @param {string?} message 
         */
        Object.prototype.assertEqual = function(expected, message) {
            return this.assert(() => this == expected, message)
        }

        /**
         * Calls the alias `assert` on this object as `chain`
         * asserting that `this === expected`
         * @param {object?} expected 
         * @param {string?} message 
         */
        Object.prototype.assertIs = function(expected, message) {
            return this.assert(() => this === expected, message)
        }
    }
}

module.exports = new proto()