module.exports = create;

function create(params) {
    return function params_validator_aspect(invocation) {
        const invocation_params = invocation.parameters[1];
        const validate = params.params_validators[invocation.memberName];
        params.params_validator_advice({ target: invocation_params, validate, member_name: invocation.memberName });
        invocation.proceed();
    };
}
