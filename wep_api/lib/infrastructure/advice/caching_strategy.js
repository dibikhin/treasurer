/**
 * @module Caching strategy advice
 */

module.exports = {
    get_balance,
    get_balance_callback,
    inc_balance
};

function get_balance(ctx, callback, account_id) {
    const cached_account = ctx.cache.get(account_id);
    if (cached_account) {
        return () => callback(null, cached_account);
    }
}

function get_balance_callback(target, that, args) {
    const account = args[1];
    this.cache.put(account._id, account); // WARN 'this' is evil
    return target.apply(null, args);
}

function inc_balance(ctx, account_id) {
    ctx.cache.del(account_id);
}