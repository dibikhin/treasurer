module.exports = create;

/**
 * Factory creating advice
 * @param {function} validator Params validator
 */
function create(ctx, validator) {
    return (invocation) => {
        const params = invocation.parameters[1];
        const validate = ctx.accounts_params_validators[invocation.memberName];
        validator(params, validate, invocation.memberName);
        invocation.proceed();
    };
}
