module.exports = create;

/**
 * Factory creating advice
 * @param {function} is_callback_valid Callback validator
 */
function create(is_callback_valid) {
    return function (invocation) {
        is_callback_valid(invocation.parameters);
        invocation.proceed(); // should be run always
    };
}
