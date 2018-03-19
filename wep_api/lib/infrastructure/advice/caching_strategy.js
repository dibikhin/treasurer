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

    // TODO pull this to caller code
    if (cached_account) {
        const exec_callback = () => callback(null, cached_account);
        return exec_callback;
    }
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

function inc_balance(ctx, account_id) {
    ctx.cache.del(account_id);
}