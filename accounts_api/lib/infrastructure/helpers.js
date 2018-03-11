/**
 * Helpers
 * All helpers live here for a while
 * @module helpers
 */

module.exports = {
    get_callback,
    set_callback,
    get_account_id,
    wrap
};

function get_callback(args) {
    const callback_index = Object.keys(args).length - 1;
    const callback = args[callback_index];
    return callback;
}

function set_callback(args, new_callback) {
    const callback_index = Object.keys(args).length - 1;
    args[callback_index] = new_callback;
}

function get_account_id(invocation) {
    return invocation['1'].account_id;
}

function wrap(fn, interceptor) {
    return new Proxy(fn, {
        apply: interceptor
    });
}