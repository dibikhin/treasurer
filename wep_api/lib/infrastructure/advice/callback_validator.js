module.exports = is_callback_valid;

function is_callback_valid(callback) {
    const is_function = typeof callback === 'function'; // TODO is_function 101 js
    const has_two_or_more_args = callback.length >= 2;
    const is_error_first_callback = is_function && has_two_or_more_args;
    if (!is_error_first_callback) {
        throw new Error('last argument should be a callback');
    }
    return true;
}
