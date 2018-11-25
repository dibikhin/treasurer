module.exports = create

function create({ params_validators, params_validator_advice }) {
    return function params_validator_aspect(invocation) {
        if (invocation && invocation.parameters) {
            const args = invocation.parameters[0]
            const validator = params_validators[invocation.memberName]
            // NOTE validate only if there is the validator
            if (validator) {
                params_validator_advice({
                    validate: validator, target: args, member_name: invocation.memberName
                })
            }
        }
        return invocation.proceed()
    }
}
