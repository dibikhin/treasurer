module.exports = create

function create({ params_validators, params_validator_advice }) {
    return function params_validator_aspect(invocation) {
        if (invocation && invocation.parameters) {
            const the_params = invocation.parameters[0] // NOTE 'params'-first expected
            const validator = params_validators[invocation.memberName]
            validator && params_validator_advice({
                validate: validator, target: the_params, member_name: invocation.memberName
            })
        }
        return invocation.proceed()
    }
}
