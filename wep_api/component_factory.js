/**
 * @module component_factory
 */

module.exports = {
    create
}

// TODO split infra|component.infra, contexts' prototypes
function create({ core_deps, infra, configs, component }) {
    const { driver, aop_provider } = core_deps
    const component_context = {}
    const proxys = {}

    // TODO treasurer.infra.interceptors_factory.create(...)
    const interceptors = get_interceptors(infra, configs, component.name)

    component_context.dal = {
        driver
    }
    proxys.dal = proxify_baked_module({
        aop_provider, infra, context: component_context.dal,
        a_module: component.dal, interceptors: interceptors.dal
    })

    component_context.model = {
        Errors: component.errors,
        Dal: proxys.dal,
        Rules: component.rules
    }
    proxys.model = proxify_baked_module({
        aop_provider, infra, context: component_context.model,
        a_module: component.model, interceptors: interceptors.model
    })

    component_context.controller = {
        Model: proxys.model
    }
    proxys.controller = proxify_baked_module({
        aop_provider, infra, context: component_context.controller,
        a_module: component.controller, interceptors: interceptors.controller
    })

    component_context.controller_proxy = proxys.controller
    component_context.model.Model = proxys.model // model should run own 'fully charged' functions too
    return component_context
}

function get_interceptors(infra, configs, component_name) {
    return {
        dal: [
            infra.aspects_factories.params_freezer_factory({
                params_freezer_advice: Object.freeze
            })
        ],
        model: [
            infra.aspects_factories.params_freezer_factory({
                params_freezer_advice: Object.freeze
            }),
            infra.aspects_factories.params_validator_factory({
                params_validators: configs[component_name].params_validators,
                params_validator_advice: infra.advice.params_validator
            })
        ],
        controller: [
            infra.aspects_factories.error_handler_factory({
                logger: configs.logger
            })
        ],
    }
}

function proxify_baked_module({ aop_provider, infra, context, interceptors, a_module }) {
    const module_baked = infra.di.inject_first_param_to_each(a_module, context)
    const module_proxy = infra.aop.proxy_factory.create({
        aop_provider,
        target: module_baked,
        interceptors
    })
    return module_proxy
}
