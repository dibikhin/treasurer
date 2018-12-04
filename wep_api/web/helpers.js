const { map, zipObj, forEach, partialRight } = require('ramda')

module.exports = {
    prepare_controller, add_error_handlers
}

// TODO rename to error_handling_strategy
function add_error_handlers({ app, error_handlers }) {
    forEach(eh => app.use(eh), error_handlers)
}

function prepare_controller({ logger, prefix, controller, error_handling_strategy }) {
    // for swagger router:
    // 'prefix_' * { 'a': b } => { 'prefix_a': b }
    const prefixed_action_names = map(action_name => prefix + action_name, Object.keys(controller))
    const add_error_handing = partialRight(error_handling_strategy, [logger])
    const wrapped_actions = map(add_error_handing, Object.values(controller))

    return zipObj(prefixed_action_names, wrapped_actions)
}
