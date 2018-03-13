module.exports = is_callback_valid;

/**
 * Checks if callback valid
 * @param {object} args Arguments where to search and validate callback
 */
function is_callback_valid(ctx, args) {
    if (!args || typeof args !== 'object') {
        throw new Error('args is required');
    }
    const callback = ctx.helpers.get_callback(args);
    const is_function = typeof callback === 'function'; // TODO is_function
    const has_two_or_more_args = callback.length >= 2;
    const is_error_first_callback = is_function && has_two_or_more_args;
    if (!is_error_first_callback) {
        throw new Error('last argument should be a callback');
    }
    return true;
}
