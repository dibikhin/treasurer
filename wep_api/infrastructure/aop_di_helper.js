module.exports = {
    proxify_baked_module
}

function proxify_baked_module({ aop_provider, infra, context, module_interceptors, a_module }) {
    const module_baked = infra.di.inject_first_param_to_each(a_module, context)
    const module_proxy = infra.aop.proxy_factory.create({
        aop_provider,
        target: module_baked,
        interceptors: module_interceptors
    })
    return module_proxy
}
