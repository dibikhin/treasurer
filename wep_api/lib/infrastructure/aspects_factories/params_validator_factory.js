module.exports = create;

/**
 * Factory creating advice
 */
function create(params) {
    return function params_validator_aspect(invocation) {
        const invocation_params = invocation.parameters[1];
        const validate = params.params_validators[invocation.memberName]; // WARN closure
        params.params_validator_advice(invocation_params, validate, invocation.memberName);
        invocation.proceed();
    };
}
