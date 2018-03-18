module.exports = create;

function create(ctx, params) { // WARN closures
    return function caching_strategy_aspect(invocation) {
        if (invocation.memberName === 'inc_balance') {
            const account_id = ctx.helpers.get_account_id(invocation.parameters);
            params.caching_strategy[invocation.memberName](ctx, account_id);
        } else if (invocation.memberName === 'get_balance') {
            const account_id = ctx.helpers.get_account_id(invocation.parameters);
            const callback = ctx.helpers.get_callback(invocation.parameters);
            const result = params.caching_strategy[invocation.memberName](ctx, callback, account_id);
            if (result) {
                return result(); // to avoid double callback execution
            }
            const bound_get_balance_callback = params.caching_strategy[invocation.memberName + '_callback'].bind(ctx); // WARN dirty state
            const wrapped_get_balance_callback = ctx.helpers.wrap_function(callback, bound_get_balance_callback);
            ctx.helpers.set_callback(invocation.parameters, wrapped_get_balance_callback);
        }

        invocation.proceed();
    };
}
