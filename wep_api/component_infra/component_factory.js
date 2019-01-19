/**
 * @module component_factory
 */

module.exports = {
    create
}

// TODO refactor, too long. SRP: fill contexts, bake/proxyfy build proxys.controller
function create({ core_deps, infra, component_interceptors, component_context, component }) {
    const { aop_provider } = core_deps

    component_context.model.Dal = create_module('dal')
    component_context.controller.Model = create_module('model')
    component_context.controller_proxy = create_module('controller')

    component_context.model.Model = component_context.controller.Model // model should run own 'fully charged' functions too
    return component_context

    function create_module(module_name) {
        return infra.aop_di_helper.proxify_baked_module({
            aop_provider, infra, context: component_context[module_name],
            a_module: component[module_name], module_interceptors: component_interceptors[module_name]
        })
    }
}
