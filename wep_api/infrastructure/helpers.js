/**
 * Helpers
 * All helpers live here for a while
 * @module helpers
 */

module.exports = {
    get_account_id,
    wrap_function
};

function get_account_id(invocation) {
    // TODO isn't generic
    return invocation['1'].account_id;
}

function wrap_function(funktion, interceptor) {
    return new Proxy(funktion, {
        apply: interceptor
    });
}
