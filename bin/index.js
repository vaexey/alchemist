#!/usr/bin/env node
const alchemist = require("../src/alchemist")

/**
 * Reads a stream to end or returns if a timeout occurs
 * @param {NodeJS.ReadStream} stream readable stream
 * @param {number?} timeout in ms (default = 10)
 * @returns {string}
 */
const readStream = async (stream, timeout) => {
    if(timeout === undefined)
        timeout = 10

    const chunks = []
    let resolved = false
    
    await new Promise((resolve) => {

        setTimeout(() => {
            if(!resolved)
                resolve()
        }, timeout)

        stream.on('data', (chunk) => {
            if(!resolved)
                chunks.push(chunk)
        })

        stream.on('end', () => {
            resolve()
        })
    })

    resolved = true
    stream.destroy()
    

    return Buffer.concat(chunks).toString('utf8');
}

const index = async () => {
    const rawArgs = process.argv
    rawArgs.shift()
    rawArgs.shift()

    const expression = rawArgs.join(" ")
    const stdin = await readStream(process.stdin)

    if(expression.length == 0)
    {
        process.stderr.write(
            `alchemist: no expression specified\n` +
            `usage: alc <javascript expression> [// arg1 [arg2 ...]]\n`
        )
        process.exitCode = -2

        return
    }

    try {
        const result = alchemist(expression, stdin)

        process.stdout.write(result)
    } catch (error) {
        process.stderr.write(error + "\n")
        process.exitCode = -1
    }

}

module.exports = index()