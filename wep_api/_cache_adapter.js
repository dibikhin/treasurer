/**
 * @module Cache adapter
 */

module.exports = {
    get_balance,
    get_balance_callback,
    inc_balance
};

function get_balance(ctx, params) {
    const cached_account = ctx.cache.get(params.account_id);
    return cached_account;
}

function get_balance_callback(target, that, args) {
    if (args) {
        const account = args[1];
        if (account) {
            this.cache.put(account._id, account); // WARN 'this' is evil
        }
    }
    return target.apply(null, args);
}

function inc_balance(ctx, params) {
    const deleted_from_cache = ctx.cache.del(params.account_id);
    return deleted_from_cache;
}
