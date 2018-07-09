module.exports = {
    create
}

// TODO split to treasurer or cfgs
// TODO aswe
function create({ infra, logger, aop_provider, target, params_validators }) {  // eslint-disable-line no-unused-vars
    return infra.aop.helpers.add_interceptions({
        aop_provider,
        target,
        interceptions: [
            // infra.aspects_factories.params_freezer_factory({
            //     params_freezer_advice: Object.freeze
            // }),
            // infra.aspects_factories.params_validator_factory({
            //     params_validators,
            //     params_validator_advice: infra.advice.params_validator
            // }),
            infra.aspects_factories.error_handler_factory({ logger })
        ]
    })
}
