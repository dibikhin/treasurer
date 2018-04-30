module.exports = {
    add_keyword,
    compile_validators
};

function add_keyword(ajv, params) {
    const validator = () => data => params.is_valid(data);
    ajv.addKeyword(params.keyword, { compile: validator });
    return ajv;
}

function compile_validators(params) {
    const validators = {};
    for (const schema_name in params.schemas) {
        validators[schema_name] = params.ajv.compile(params.schemas[schema_name]);
    }
    return validators;
}
