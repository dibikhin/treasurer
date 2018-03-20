module.exports = init_caching_strategy;

function init_caching_strategy() {
    const inc_balance_handler = (ctx, params, next) => {
        const account_id = ctx.helpers.get_account_id(params.invocation.parameters);
        const deleted_from_cache = ctx.cache_adapter[params.invocation.memberName](ctx, { account_id });
        // TODO ctx.logger.debug(deleted_from_cache);
        next();
    };
    const get_balance_handler = (ctx, params, next) => {
        const account_id = ctx.helpers.get_account_id(params.invocation.parameters);
        const callback = ctx.helpers.get_callback(params.invocation.parameters);
        const cached_account = ctx.cache_adapter[params.invocation.memberName](ctx, { account_id });
        if (cached_account) {
            return callback(null, cached_account);
        }
        const bound_get_balance_callback = ctx.cache_adapter[params.invocation.memberName + '_callback'].bind(ctx); // WARN dirty state
        const wrapped_get_balance_callback = ctx.helpers.wrap_function(callback, bound_get_balance_callback);
        ctx.helpers.set_callback(params.invocation.parameters, wrapped_get_balance_callback);

        next();
    };
    const caching_strategy = {
        inc_balance: inc_balance_handler,
        get_balance: get_balance_handler
    };
    return caching_strategy;
}
