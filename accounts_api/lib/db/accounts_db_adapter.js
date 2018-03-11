/**
 * Account's DB Adapter
 * @module accounts_db_adapter
*/

module.exports = {
    get_balance,
    inc_balance,
    dec_balance
};

/**
 * Gets balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts
 * @param {object} ctx.db.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function get_balance(ctx, params, done) {
    // const cached_account = ctx.cache.get(params.account_id);
    // if (cached_account) {
    //     return done(null, cached_account);
    // }
    ctx.db.accounts
        .findOne(
            new ctx.driver.ObjectID(params.account_id),
            (err, account) => {
                if (!account) return done('nothing found', null);
                // ctx.cache.put(params.account_id, account);
                return done(err, account);
            });
}

/**
 * Increases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts
 * @param {object} ctx.db.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function inc_balance(ctx, params, done) {
    ctx.db.accounts
        .findAndModify(
            { '_id': new ctx.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    balance: ctx.driver.Decimal128.fromString(params.incoming)
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true }, // return updated doc
            done);
}

/**
 * Decreases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts
 * @param {object} ctx.db.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function dec_balance(ctx, params, done) {
    ctx.db.accounts
        .findAndModify(
            { '_id': new ctx.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    balance: ctx.driver.Decimal128.fromString('-' + params.outgoing) // dirty minus
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true }, // return updated doc
            done);
}
