module.exports = create;

/**
 * Factory creating advice
 * @param {function} params_validator_advice Params validator
 */
function create(ctx, params_validator_advice) {
    return function params_validator_aspect(invocation) {
        const params = invocation.parameters[1];
        const validate = ctx.params_validators[invocation.memberName]; // WARN closure
        params_validator_advice(params, validate, invocation.memberName);
        invocation.proceed();
    };
}
