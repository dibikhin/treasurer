module.exports = create;

function create(ctx) { // WARN closures
    return function caching_strategy_aspect(invocation) {
        if (invocation.memberName === 'inc_balance') {
            const account_id = ctx.helpers.get_account_id(invocation.parameters);
            ctx.cache_adapter[invocation.memberName](ctx, { account_id });
            // TODO ctx.logger.debug(deleted_from_cache);
        }
        if (invocation.memberName === 'get_balance') {
            const account_id = ctx.helpers.get_account_id(invocation.parameters);
            const callback = ctx.helpers.get_callback(invocation.parameters);
            const cached_account = ctx.cache_adapter[invocation.memberName](ctx, { account_id });
            if (cached_account) {
                return callback(null, cached_account);
            }
            const bound_get_balance_callback = ctx.cache_adapter[invocation.memberName + '_callback'].bind(ctx); // WARN dirty state
            const wrapped_get_balance_callback = ctx.helpers.wrap_function(callback, bound_get_balance_callback);
            ctx.helpers.set_callback(invocation.parameters, wrapped_get_balance_callback);
        }
        invocation.proceed();
    };
}
