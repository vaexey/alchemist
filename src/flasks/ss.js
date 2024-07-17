const flask = require("../flask")

/**
 * A wrapper that implements various syntactic
 * sugar enchancements to the string prototype
 */
class ss extends Function
{
    /**
     * @param {any?} base Object to be casted to string
     */
    constructor(base)
    {
        super()

        /** @type {string} Base string */
        this.string = base + ""

        // Must redefine Function.length property
        Object.defineProperty(this, 'length', {
            get: function() {
                const that = this
                const len = () => that.len()
        
                len.toString = () => that.len()
        
                return len
            }
        })

        // Returning a proxy allows 'overloading' index operator
        return new Proxy(this, {
            get: (obj, key) => {
                if(typeof(key) === 'string' && Number.isInteger(+key))
                    return obj.get(key)
                else
                    return obj[key]
            },
            set: (obj, key, value) => {
                if(typeof(key) === 'string' && Number.isInteger(+key))
                    return obj.set(key, value)
                else
                    return obj[key] = value
            },
            apply: (obj, thisArg, args) => {
                return obj
            }
        })
    }

    /**
     * Returns character at given index
     * @param {number} index
     * @returns {string} char
     * @throws when index is invalid
     */
    get(index) {
        return this.string.charAt(this.transposeIndex(index))
    }

    /**
     * Sets string at a given index.  
     * If `value.length == 0`, character at given index is removed.  
     * If `value.length == 1`, character at given index is replaced.  
     * If `value.length > 1`, characters starting from `index` are
     * replaced by characters from string `value`
     * @param {number} index start index of value string in the base string
     * @param {string} value string to be replaced at the index
     * @returns `value`
     * @throws when index is invalid
     */
    set(index, value) {
        if(value === undefined || value === null)
            value = ''
        else
            value = "" + value

        index = this.transposeIndex(index)

        this.string = 
            this.string.substring(0, index) +
            value +
            this.string.substring(index + Math.max(value.length, 1))
        
        return value
    }

    /**
     * @returns base string length
     */
    len() {
        return this.string.length
    }

    /**
     * Transposes convenient indexing 
     * (eg. negative numbers serving as reverse indexing)
     * to base string index
     * @param {number} index convenient index
     * @returns {number} valid base string index
     * @throws when index is invalid
     */
    transposeIndex(index) {
        index = +index

        if(!Number.isInteger(index))
            throw `ss: index "${index}" is not an integer`

        if(index < 0)
        {
            index += this.len()
        }

        if(index < 0 || index > this.len() - 1)
            throw `ss: index "${index}" is out of bounds (0:${this.len()-1})`
        
        return index
    }
}

class ssflask extends flask
{
    constructor()
    {
        super()

        this.id = "ss"
        this.name = "String extensions"
        this.description = `The 'ss' class with all its methods that make modifying strings easier.`
    }

    load()
    {
        ss.prototype.toString = function() {
            return this.string
        }

        Object.defineProperty(Object.prototype, 'ss', {
            get: function() {
                return new ss(this)
            }
        })
    }

    variables()
    {
        return {
            ss
        }
    }
}

module.exports = new ssflask()