/**
 * @module component_factory
 */

module.exports = {
    create
}

function create({ core_deps, infra, component_interceptors, component }) {
    const { driver, aop_provider } = core_deps
    const component_context = {}
    const proxys = {}

    component_context.dal = {
        driver
    }
    proxys.dal = infra.aop_di_helper.proxify_baked_module({
        aop_provider, infra, context: component_context.dal,
        a_module: component.dal, module_interceptors: component_interceptors.dal
    })

    component_context.model = {
        Errors: component.errors,
        Dal: proxys.dal,
        Rules: component.rules
    }
    proxys.model = infra.aop_di_helper.proxify_baked_module({
        aop_provider, infra, context: component_context.model,
        a_module: component.model, module_interceptors: component_interceptors.model
    })

    component_context.controller = {
        Model: proxys.model
    }
    proxys.controller = infra.aop_di_helper.proxify_baked_module({
        aop_provider, infra, context: component_context.controller,
        a_module: component.controller, module_interceptors: component_interceptors.controller
    })

    component_context.controller_proxy = proxys.controller
    component_context.model.Model = proxys.model // model should run own 'fully charged' functions too
    return component_context
}
