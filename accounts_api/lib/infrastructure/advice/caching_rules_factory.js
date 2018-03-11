module.exports = create;

/**
 * Factory creating advice
 * @param {string} function_name    Function to catch
 */
function create(ctx) {
    function _callback_interceptor(target, that, args) {
        const account = args[1];
        ctx.cache.put(account._id, account);
        return target.apply(null, args);
    }

    function inc_balance(invocation) {
        if (invocation.memberName === 'inc_balance') {
            const account_id = ctx.helpers.get_account_id(invocation.parameters);
            ctx.cache.del(account_id);
        }
        invocation.proceed();
    }

    function get_balance(invocation) {
        if (invocation.memberName === 'get_balance') {
            const callback = ctx.helpers.get_callback(invocation.parameters);
            const account_id = ctx.helpers.get_account_id(invocation.parameters);
            const cached_account = ctx.cache.get(account_id);
            if (cached_account) {
                return callback(null, cached_account);
            }

            const callback_wrapped = ctx.helpers.wrap(callback, _callback_interceptor);
            ctx.helpers.set_callback(invocation.parameters, callback_wrapped);
        }

        invocation.proceed();
    }

    const caching_rules = { get_balance, inc_balance };
    return caching_rules;
}



