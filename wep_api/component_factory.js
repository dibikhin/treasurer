/**
 * @module component_factory
 */

module.exports = {
    create
}

function create({ core_deps, infra, configs, component }) {
    const { driver, aop_provider } = core_deps
    const component_context = {}
    const proxys = {}

    component_context.dal = {
        driver
    }

    proxys.dal = proxify_baked_dal({ aop_provider, infra, component_context, component })
    component_context.model = {
        Errors: component.errors,
        Dal: proxys.dal,
        Model: null,
        Rules: component.rules
    }

    proxys.model = proxify_baked_model({ aop_provider, infra, component_context, configs, component })
    component_context.controller = {
        Model: proxys.model
    }

    proxys.controller = proxify_baked_controller({ aop_provider, infra, component_context, configs, component })
    component_context.controller_proxy = proxys.controller

    component_context.model.Model = proxys.model // model should run own 'fully charged' functions too

    return component_context
}

// TODO below: generalize and move to The Framework
function proxify_baked_dal({ aop_provider, infra, component_context, component }) {
    const dal_baked = infra.di.inject_first_param_to_each(component.dal, component_context.dal)
    const dal_proxy = infra.aop.proxy_factory.create({
        aop_provider,
        target: dal_baked,
        interceptors: [
            infra.aspects_factories.params_freezer_factory({
                params_freezer_advice: Object.freeze
            })
        ]
    })
    return dal_proxy
}

function proxify_baked_model({ aop_provider, infra, component_context, configs, component }) {
    const model_baked = infra.di.inject_first_param_to_each(component.model, component_context.model)
    const model_proxy = infra.aop.proxy_factory.create({
        aop_provider,
        target: model_baked,
        interceptors: [
            infra.aspects_factories.params_freezer_factory({
                params_freezer_advice: Object.freeze
            }),
            infra.aspects_factories.params_validator_factory({
                params_validators: configs[component.name].params_validators,
                params_validator_advice: infra.advice.params_validator
            })
        ]
    })
    return model_proxy
}

function proxify_baked_controller({ aop_provider, infra, component_context, configs, component }) {
    const controller_baked = infra.di.inject_first_param_to_each(component.controller, component_context.controller)
    const controller_proxy = infra.aop.proxy_factory.create({
        aop_provider,
        target: controller_baked,
        interceptors: [
            infra.aspects_factories.error_handler_factory({ logger: configs.logger })
        ]
    })
    return controller_proxy
}
