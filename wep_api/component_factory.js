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
    const component_interceptors = get_interceptors({
        infra, params_validators: configs[component.name].params_validators, logger: configs.logger
    })

    component_context.dal = {
        driver
    }
    proxys.dal = proxify_baked_module({
        aop_provider, infra, context: component_context.dal,
        a_module: component.dal, interceptors: component_interceptors.dal
    })

    component_context.model = {
        Errors: component.errors,
        Dal: proxys.dal,
        Rules: component.rules
    }
    proxys.model = proxify_baked_module({
        aop_provider, infra, context: component_context.model,
        a_module: component.model, interceptors: component_interceptors.model
    })

    component_context.controller = {
        Model: proxys.model
    }
    proxys.controller = proxify_baked_module({
        aop_provider, infra, context: component_context.controller,
        a_module: component.controller, interceptors: component_interceptors.controller
    })

    component_context.controller_proxy = proxys.controller
    component_context.model.Model = proxys.model // model should run own 'fully charged' functions too
    return component_context
}

function get_interceptors({ infra, params_validators, logger }) {
    const { filter, identity, map, partial, pipe, } = require('ramda')
    const aspects_configs = aspects_config_factory_create({ params_validators, logger })
    // aspects_configs -> { layer: [ null, interceptor, undefined ] } -> component_interceptors
    const compose_component_interceptors = x => map(pipe(
        partial(module_interceptors_factory_create, [infra]), filter(identity)), x)
    const component_interceptors = compose_component_interceptors(aspects_configs)
    return component_interceptors
}

function module_interceptors_factory_create(infra, aspects_configs) {
    const module_interceptors = [
        aspects_configs.params_freezer && infra.aspects_factories.params_freezer_factory({
            params_freezer_advice: aspects_configs.params_freezer,
        }),
        aspects_configs.params_validators && infra.aspects_factories.params_validator_factory({
            params_validators: aspects_configs.params_validators,
            params_validator_advice: infra.advice.params_validator,
        }),
        aspects_configs.logger && infra.aspects_factories.error_handler_factory({
            logger: aspects_configs.logger,
            // error handling strategy
        })
    ]
    return module_interceptors
}

// Aspects' Configs Factory
function aspects_config_factory_create({ params_validators, logger }) {
    return {
        dal: {
            params_freezer: Object.freeze, // strategy
            // params_validators
            // logger
        },
        model: {
            params_freezer: Object.freeze,
            params_validators
            // logger
        },
        controller: {
            // params_freezer
            // params_validators
            logger
        },
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
