module.exports = {
    add_keyword,
    compile_validators
};


function add_keyword(ajv, params) {
    ajv.addKeyword(params.keyword, {
        compile: schema => data => params.is_valid(data)
    });
    return ajv;
}

function compile_validators(params) {
    const validators = {};
    for (let schema_name in params.schemas) {
        validators[schema_name] = params.ajv.compile(params.schemas[schema_name]);
    }
    return validators;
}