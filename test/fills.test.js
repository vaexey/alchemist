const flasks = require("./../src/flasks")

let data = {
    expression: "",
    variables: {
        alchemist: {}
    }
}

flasks.flasks.forEach(f => {
    f.load()

    data = f.beforeVariables(data)
    data = f.beforeEval(data)
    flasks.mergeVariables(data.variables, f.variables())
})

const fills = data.variables

describe("fills functions", () => {
    // test("logging", () => {
    //     fills.log()
    //     fills.log(1)
    //     fills.log("", 2)
        
    //     expect(() => fills.error("testing error function successful")).toThrow()
    // })

    test("assertion", () => {
        const obj = {
            a: 1
        }

        expect(() => fills.assert(false)).toThrow()
        expect(() => fills.assert(false, "123")).toThrow()
        expect(() => fills.assert(false, "123", obj)).toThrow()

        expect(() => fills.assert(1)).toThrow()
        expect(() => fills.assert(1, "123")).toThrow()
        expect(() => fills.assert(1, "123", obj)).toThrow()

        expect(() => fills.assert("true")).toThrow()
        expect(() => fills.assert("true", "123")).toThrow()
        expect(() => fills.assert("true", "123", obj)).toThrow()
        
        fills.assert(true)
        fills.assert(true, "123")
        expect(fills.assert(true, "123", obj)).toBe(obj)
    })

    test("exitCode", () => {
        process.exitCode = undefined
        fills.exitCode(0)
        expect(process.exitCode).toBe(0)

        process.exitCode = undefined
        fills.exitCode(1)
        expect(process.exitCode).toBe(1)

        const obj = { a: 1 }

        process.exitCode = undefined
        const chained = fills.exitCode(2, obj)

        expect(process.exitCode).toBe(2)
        expect(chained).toBe(obj)
    })
})

describe("object extensions", () => {
    test("json", () => {
        const object = {
            a: {
                b: "c",
                d: 1
            },
            e: true,
            f: ["g", "h", 5]
        }

        const json = JSON.stringify(object)
        const prettyJson = JSON.stringify(object, null, 4)

        expect(object.toJson()).toBe(json)
        expect(object.toJson(true)).toBe(prettyJson)

        expect(json.json()).toEqual(object)
        expect(prettyJson.json()).toEqual(object)
    })

    test("ss existence", () => {
        const val = "abc"
        const obj = val.ss

        expect(!!obj).toBe(true)

        expect(obj.string).toBe(val)
    })
})