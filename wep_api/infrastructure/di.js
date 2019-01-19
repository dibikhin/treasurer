/**
 * @module DependencyInjector
 */

const { map, partial, partialRight } = require('ramda')

module.exports = {
    inject_first_param_to_each
}

/**
 * Homemade dependency injection by partial application
 */
function inject_first_param_to_each(target_module, first_param) {
    const to_async_partial_action_partial = partialRight(to_async_partial_action, [first_param])
    return map(to_async_partial_action_partial, target_module)
}

/**
 * @private
 */
function to_async_partial_action(action, first_param) {
    const partial_action = partial(action, [first_param])
    const async_action = async (...args) => partial_action(...args)
    return async_action
}
