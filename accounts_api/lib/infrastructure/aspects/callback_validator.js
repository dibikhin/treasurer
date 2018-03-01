module.exports = is_valid;

/**
 * Checks if callback valid
 * @param {object} args Arguments where to search and validate callback
 */
function is_valid(args) {
    if (!args || typeof args !== 'object') {
        throw new Error('params is required');
    }
    const callback_index = Object.keys(args).length - 1;
    const callback = args[callback_index];
    const is_function = typeof callback === 'function';
    const has_two_or_more_args = callback.length >= 2;
    const is_error_first_callback = is_function && has_two_or_more_args;
    if (!is_error_first_callback) {
        throw new Error('last argument should be a callback');
    }
    return true;
}