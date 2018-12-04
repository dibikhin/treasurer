const { map, mergeAll, pipe } = require('ramda')

module.exports = {
    add_keyword, compile_validators
}

function add_keyword(ajv, params) {
    const validator = () => data => params.is_valid(data)
    ajv.addKeyword(params.keyword, { compile: validator })
    return ajv
}

function compile_validators({ ajv, schemas }) {
    const compile_all = map(schema => ajv.compile(schema))
    const generate_validators = pipe(compile_all, mergeAll)
    return generate_validators(schemas)
}
