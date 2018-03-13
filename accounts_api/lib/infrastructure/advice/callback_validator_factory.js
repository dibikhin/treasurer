module.exports = create;

/**
 * Factory creating advice
 * @param {function} validator Callback validator
 */
function create(ctx, validator) {
    return function (invocation) {
        validator(ctx, invocation.parameters);
        invocation.proceed();
    };
}
