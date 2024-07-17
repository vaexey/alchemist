const fs = require('fs')
const path = require('path')
const os = require('os')

function getDataPath() {
    switch (this.__platform || process.platform) {
        case 'win32': return path.resolve(process.env.APPDATA)
        case 'darwin': return path.resolve(path.join(home.call(this), 'Library/Application Support/'))
        default: return process.env.XDG_CONFIG_HOME
            ? path.resolve(process.env.XDG_CONFIG_HOME)
            : path.resolve(path.join(home.call(this), '.config/'))
    }
}

class alchemistConfig
{
    constructor()
    {
        this.flasks = ['alc']
        this.lastConfigPath = null
    }

    validPaths()
    {
        const home = os.homedir()

        const homeBasedDirs = [
            ["AppData", "Roaming"],
            ["AppData", "Roaming", "alchemist"],
            [".config"],
            ["config"],
            [".config", "alchemist"],
            []
        ]

        const cwdBasedDirs = [
            []
        ]

        const filenames = [
            "alchemist.json",
            ".alchemist.json",
            ".alchemist",
            "alc.json",
            ".alc.json",
            ".alc",
        ]

        const paths = [
            ...cwdBasedDirs.map(next => path.join(process.cwd(), ...next)),
            ...homeBasedDirs.map(next => path.join(home, ...next))
        ].map(dir => filenames.map(file => path.join(dir, file)))
        .flat(1)

        return paths
    }

    read()
    {
        const paths = this.validPaths()

        let text

        for(let path of paths)
        {
            try {
                text = fs.readFileSync(path)

                break
            } catch (error) {
                continue
            }
        }

        if(text)
        {
            this.deserialize(text)
        }
    }

    deserialize(text)
    {
        const json = JSON.parse(text)
        const allowed = Object.keys(this)

        Object.keys(json).forEach(key => {
            if(!allowed.includes(key))
            {
                throw `config error: unknown key ${key} in alchemist config file`
            }

            if(typeof this[key] !== typeof json[key] ||
                Array.isArray(this[key] !== Array.isArray(json[key])))
            {
                throw `config error: type mismatch at key ${key}. value should be ${typeof this[key]}`
            }

            this[key] = json[key]
        })
    }

    serialize()
    {
        return JSON.stringify(this, null, 4)
    }

    toString()
    {
        return this.serializeToString()
    }
}

module.exports = new alchemistConfig

