module.exports = {
    init
};

function init({ infra, aop_provider, target, params_validators }) {
    return infra.aop.add_interceptions({
        aop_provider,
        target,
        interceptions: [
            infra.aspects_factories.params_freezer_factory({
                params_freezer_advice: Object.freeze
            }),
            infra.aspects_factories.params_validator_factory({
                params_validators,
                params_validator_advice: infra.advice.params_validator
            })
        ]
    });
}
