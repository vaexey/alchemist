let stdin = require("mock-stdin").stdin();

const runAlchemist = async(...args) => {
    process.argv = [
        "node",
        "cli.js",
        ...args
    ]

    const stdoutSpy = jest.spyOn(process.stdout, "write")

    await require("./../bin/index")

    return stdoutSpy
}

const runAlchemistWithStdin = async(data, eof, ...args) => {
    let [stdoutSpy, _] = await Promise.all([
        runAlchemist(...args),
        (async () => {
            await sleep(1)

            stdin.send(data)

            if(eof)
                stdin.end()
        })()
    ])

    return stdoutSpy
}

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

describe("expressions", () => {
    let originalArgv;

    beforeAll(() => {
        originalArgv = process.argv
        
        // Allow redefining properties for test purposes
        // https://stackoverflow.com/questions/57755086/override-object-property-for-unit-testing-purposes
        const originalDefineProperty = Object.defineProperty;
        const originalDefineProperties = Object.defineProperties;

        Object.defineProperty = (obj, prop, desc) => {
            try {
                return originalDefineProperty(obj, prop, {...desc, configurable: true});
            } catch(e) {
                return originalDefineProperty(obj, prop, desc);
            }
        };

        Object.defineProperties = (obj, props) => {
            const propsCopy = {...props};

            Object.keys(propsCopy).forEach((key) => {
                propsCopy[key].configurable = true;
            });

            try {
                return originalDefineProperties(obj, propsCopy);
            } catch(e) {
                return originalDefineProperties(obj, props);
            }
        };
    })

    beforeEach(() => {        
        jest.resetModules()

        process.exitCode = 0

        stdin.reset()
        stdin.restore()
        stdin = require("mock-stdin").stdin();
    })

    afterEach(() => {
        jest.resetAllMocks()

        process.argv = originalArgv
    })

    test("return constant", async () => {
        const stdout = await runAlchemist("CRLF")
        
        expect(process.exitCode).toBe(0)
        expect(stdout).toHaveBeenCalledWith("\r\n")
    })

    test("return first argument", async () => {
        const stdout = await runAlchemist("args[0]", "//", "abc")

        expect(stdout).toHaveBeenCalledWith("abc")
    })

    test("return stdin", async () => {

        const stdout = await runAlchemistWithStdin(
            "test string", true,
            "stdin"
        )

        expect(stdout).toHaveBeenCalledWith("test string")
    })

    test("return stdin and args", async () => {

        const stdout = await runAlchemistWithStdin(
            "test string", true,
            "stdin + ' ' + args[0] // test arg"
        )

        expect(stdout).toHaveBeenCalledWith("test string test")
    })

    test("implicit stdin variable", async () => {

        const stdout = await runAlchemistWithStdin(
            "test string", true,
            ".split(' ').join(',')"
        )

        expect(stdout).toHaveBeenCalledWith("test,string")
    })

    test("implicit anonymous function", async () => {

        const stdout = await runAlchemistWithStdin(
            "test string", true,
            "@return stdin"
        )

        expect(stdout).toHaveBeenCalledWith("test string")
    })

    test("implicit stdin and anonymous function", async () => {

        const stdout = await runAlchemistWithStdin(
            "test string", true,
            "@.length ?? console.log('not '); return stdin"
        )

        expect(stdout).toHaveBeenCalledWith("test string")
    })
})