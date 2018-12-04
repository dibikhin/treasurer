/**
 * @module interceptors_template_factory
 */

module.exports = {
    create
}

function create(infra, aspects_configs) {
    const interceptors_template = [
        aspects_configs.params_freezer && infra.aspects_factories.params_freezer_factory({
            params_freezer_advice: aspects_configs.params_freezer,
        }),
        aspects_configs.params_validators && infra.aspects_factories.params_validator_factory({
            params_validators: aspects_configs.params_validators,
            params_validator_advice: infra.advice.params_validator,
        }),
        aspects_configs.logger && infra.aspects_factories.error_handler_factory({
            logger: aspects_configs.logger,
            // error handling strategy
        })
    ]
    return interceptors_template
}
