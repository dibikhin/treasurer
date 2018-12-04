module.exports = {
    create
}

function create({ core_deps, infra, configs, web, contexts, component }) {
    contexts[component.name] = {}
    contexts[component.name].dal = { driver: core_deps.driver }

    const dal_proxy = proxify_baked_dal({ core_deps, infra, contexts, component })
    contexts[component.name].model = {
        Errors: component.errors,
        Dal: dal_proxy,
        Model: null,
        Rules: component.rules
    }

    const model_proxy = proxify_baked_model({ core_deps, infra, contexts, configs, component })
    contexts[component.name].controller = {
        Model: model_proxy
    }
    contexts[component.name].model.Model = model_proxy // model should run own fully 'charged' functions too

    Object.freeze(contexts) // TODO freeze deeper

    const controller = web.helpers.prepare_controller({
        logger: configs.logger, prefix: configs.web.controller_prefix,
        controller: component.controller, error_handling_strategy: infra.error_handling_strategy,
    })
    const controller_proxy = proxify_baked_controller({
        core_deps, infra, contexts, configs, controller, component
    })
    return controller_proxy
}

// TODO below: generalize and move to The Framework
function proxify_baked_dal({ core_deps, infra, contexts, component }) {
    const dal_baked = infra.di.inject_first_param(component.dal, contexts[component.name].dal)
    const dal_proxy = infra.aop.proxy_factory.create({
        aop_provider: core_deps.benalu,
        target: dal_baked,
        interceptors: [
            infra.aspects_factories.params_freezer_factory({
                params_freezer_advice: Object.freeze
            })
        ]
    })
    return dal_proxy
}

function proxify_baked_model({ core_deps, infra, contexts, configs, component }) {
    const model_baked = infra.di.inject_first_param(component.model, contexts[component.name].model)
    const model_proxy = infra.aop.proxy_factory.create({
        aop_provider: core_deps.benalu,
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

function proxify_baked_controller({ core_deps, infra, contexts, configs, controller, component }) {
    const controller_baked = infra.di.inject_first_param(controller, contexts[component.name].controller)
    const controller_proxy = infra.aop.proxy_factory.create({
        aop_provider: core_deps.benalu,
        target: controller_baked,
        interceptors: [
            infra.aspects_factories.error_handler_factory({ logger: configs.logger })
        ]
    })
    return controller_proxy
}
