/**
 * Helpers
 * @module helpers
 */

const { map, partial } = require('ramda')

module.exports = {
    bake_context, wrap_function
}

function bake_context(target, first_param) {
    const partial_action_async = action => async (...args) => partial(action, [first_param])(...args)
    return map(partial_action_async, target)
}

function wrap_function(funktion, interceptor) {
    return new Proxy(funktion, {
        apply: interceptor
    })
}
