/**
 * Helpers
 * @module helpers
 */

const { map, partial } = require('ramda')

module.exports = {
    inject_first_param
}

/**
 * Homemade dependency injection by partial application
 */
function inject_first_param(target_module, first_param) {
    const to_async_partial_action = action => {
        const partial_action = partial(action, [first_param])
        const async_action = async (...args) => partial_action(...args)
        return async_action
    }
    return map(to_async_partial_action, target_module)

    // const partial_action = (action, first_param) => partial(action, [first_param])
    // const async_action = action => async (...args) => action(...args)
    // const async_partial_action = pipe(partial_action, async_action)(target_module, first_param)
    // return map(async_partial_action, target_module)
    // TODO refactor ^
}
