/**
 * @module component_context_factory
 */

module.exports = {
    create
}

function create({ core_deps, component }) {
    const component_context = {
        dal: {
            driver: core_deps.driver
        },
        model: {
            Errors: component.errors,
            Dal: null,
            Model: null,
            Rules: component.rules
        },
        controller: {
            Model: null
        },
        controller_proxy: null,
    }
    return component_context
}
