module.exports = {
    configure
}

/**
 * Factory of strategies
 */
function configure({ ajv, custom_infra, mongo_is_valid, schemas }) {
    const _ajv = new ajv({ allErrors: true })
    custom_infra.ajv.add_custom_keywords({ mongo_is_valid, ajv: _ajv, ajv_helpers: custom_infra.ajv.helpers })
    const params_validators = custom_infra.ajv.helpers.compile_validators({ ajv: _ajv, schemas })
    return params_validators
}
