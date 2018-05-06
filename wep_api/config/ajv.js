module.exports = { config };

function config({ _ajv, infra, mongo_is_valid, schemas }) {
    const ajv = new _ajv({ allErrors: true });
    infra.ajv.add_custom_keywords({ mongo_is_valid, ajv, ajv_helpers: infra.ajv.helpers });
    const params_validators = infra.ajv.helpers.compile_validators({
        ajv, schemas
    });
    return params_validators;
}
