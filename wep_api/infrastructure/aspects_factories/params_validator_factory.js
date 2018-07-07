module.exports = create

function create({ params_validators, params_validator_advice }) {
    return function params_validator_aspect(invocation) {
        if (invocation && invocation.parameters) {
            const invocation_params = invocation.parameters[0]
            const validate = params_validators[invocation.memberName]
            params_validator_advice({
                target: invocation_params, validate, member_name: invocation.memberName
            })
        }
        return invocation.proceed()
    }
}
