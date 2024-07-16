const ssflask = require('./../src/flasks/ss')
const ss = ssflask.variables().ss

ssflask.load()

describe("ss instantiating", () => {
    test("new", () => {
        const val = new ss("abc")

        expect(val.string).toEqual("abc")
    })

    test("from string explicit", () => {
        const val = "abc".ss()

        expect(val.string).toEqual("abc")
    })

    test("from string as property", () => {
        const val = "abc".ss

        expect(val.string).toEqual("abc")
    })

    test("from number", () => {
        const val = (123).ss

        expect(val.string).toEqual("123")
    })
})

describe("ss implicit conversion", () => {
    test("to string", () => {
        const val = "abc".ss

        expect(""+val).toBe("abc")
    })

    test("to number", () => {
        const val = "123".ss

        expect(+val).toBe(123)
    })
})

describe("ss index operator", () => {
    test("index transposition", () => {
        const val = "abc".ss

        expect(val.transposeIndex(0)).toBe(0)
        expect(val.transposeIndex(1)).toBe(1)
        expect(val.transposeIndex(2)).toBe(2)

        expect(val.transposeIndex(-3)).toBe(0)
        expect(val.transposeIndex(-2)).toBe(1)
        expect(val.transposeIndex(-1)).toBe(2)

        expect(() => val.transposeIndex(3)).toThrow()
        expect(() => val.transposeIndex(-4)).toThrow()
    })

    test("get single", () => {
        const val = "abc".ss

        expect(val[0]).toBe('a')
        expect(val[1]).toBe('b')
        expect(val[2]).toBe('c')

        expect(val[-3]).toBe('a')
        expect(val[-2]).toBe('b')
        expect(val[-1]).toBe('c')
    })

    test("set single", () => {
        const val = "abc".ss

        val[0] = 'd'
        val[1] = 'e'
        val[2] = 'f'

        expect(val.string).toBe("def")
    })

    test("set multiple/empty", () => {
        const val = "abc".ss

        val[0] = ''
        val[1] = 'def'
        val[2] = 'g'

        expect(val.string).toBe("bdgf")
    })

    test("set multiple", () => {
        const val = "abcdef".ss

        val[1] = "ghi"

        expect(val.string).toBe("aghief")
    })

    test("invalid", () => {
        const val = "abc".ss

        expect(() => val[3]).toThrow()
        expect(() => val[-4]).toThrow()
    })
})

describe("ss length", () => {
    test("main implementation", () => {
        const val = "abc".ss

        expect(val.len()).toBe(3)
    })

    test("'length' as a function", () => {
        const val = "abc".ss

        expect(val.length()).toBe(3)
    })

    test("'length' as an implicitly cast property", () => {
        const val = "abc".ss

        expect(+val.length()).toBe(3)
    })
})

describe("string operations", () => {
    test("remove second last char if matches", () => {
        const match = "!"

        const run = (testString, validString) => {
            const str = testString.ss
            if(str[-2] === '!')
            {
                str[-2] = ''
            }

            expect(""+str).toBe(validString)
        }

        run("abc def ghi", "abc def ghi")
        run("abc def g!i", "abc def gi")
        run("abc def gh!", "abc def gh!")
        run("abc def g!!", "abc def g!")
    })
})