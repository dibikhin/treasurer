module.exports = create;

/**
 * Factory creating advice
 * @param {function} is_callback_valid Callback validator
 */
function create(ctx, is_callback_valid) {
    return function (invocation) {
        is_callback_valid(ctx, invocation.parameters);
        invocation.proceed();
    };
}
