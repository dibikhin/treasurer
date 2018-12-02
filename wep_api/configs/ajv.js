module.exports = {
    configure
}

/**
 * Factory of strategies
 */
function configure({ ajv, infra, mongo_is_valid, schemas }) {
    const _ajv = new ajv({ allErrors: true })
    infra.ajv.add_custom_keywords({ mongo_is_valid, ajv: _ajv, ajv_helpers: infra.ajv.helpers })
    const params_validators = infra.ajv.helpers.compile_validators({ ajv: _ajv, schemas })
    return params_validators
}
