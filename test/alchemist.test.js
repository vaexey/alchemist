const alchemist = require("./../src/alchemist")

describe("alchemist extractArgs", () => {
    test("Parse simple args", () => {
        const args = 
            alchemist
            .extractArgs(
                `console.log('a') // arg1 arg2 test`
            )
        expect(args).toEqual([`console.log('a') `, 'arg1', 'arg2', 'test'])
    })

    test("Parse args after simple quoted delimeter", () => {
        const args = 
            alchemist
            .extractArgs(
                `console.log('//') // arg1 arg2 test`
            )
        expect(args).toEqual([`console.log('//') `, 'arg1', 'arg2', 'test'])
    })

    test("Parse args after multiple quoted delimeters", () => {
        const args = 
            alchemist
            .extractArgs(
                `console.log('//' + "abc//" + "//def") // arg1 arg2 test`
            )
        expect(args).toEqual([`console.log('//' + "abc//" + "//def") `, 'arg1', 'arg2', 'test'])
    })

    test("Parse args after multiple quoted delimeters with escape character", () => {
        const args = 
            alchemist
            .extractArgs(
                `console.log('//' + "abc//" + "//def\\"") // arg1 arg2 test`
            )
        expect(args).toEqual([`console.log('//' + "abc//" + "//def\\"") `, 'arg1', 'arg2', 'test'])
    })
    
    // TODO:
    // test("Parse complex args", () => {
    //     const args = 
    //         alchemist
    //         .extractArgs(
    //             `console.log('a') // arg1 "arg2 test" test2`
    //         )
    //     expect(args).toEqual(['arg1', 'arg2 test', 'test2'])
    // })
})