const _scopedEval = (___expression_, ___variables_) => {
    return eval(
        `'use strict';` +
        Object.keys(___variables_).map(
            name => `var ${name} = ___variables_.${name};`
        ).join("") +
        ___expression_
    )
}

const scopedEval = (expression, variables) => {
    return _scopedEval(expression, variables)
}

module.exports = scopedEval