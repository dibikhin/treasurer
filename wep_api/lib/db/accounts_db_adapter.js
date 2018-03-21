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
 * @param {object} ctx.db.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function get_balance(ctx, params, done) {
    // { value: data } is for common result with db.collection.findAndModify()
    const get_balance_callback = (err, data) => done(err, data ? { value: data } : params);
    const account_mongo_id = new ctx.driver.ObjectID(params.account_id);
    ctx.db.accounts.findOne(account_mongo_id, get_balance_callback);
}

/**
 * Increases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function inc_balance(ctx, params, done) {
    const inc_balance_params = { account_id: params.account_id, amount: params.incoming };
    const inc_balance_callback = (err, data) => done(err, data || params);
    _inc_balance(ctx, inc_balance_params, inc_balance_callback);
}

/**
 * Decreases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function dec_balance(ctx, params, done) {
    const dec_balance_params = { account_id: params.account_id, amount: '-' + params.outgoing }; // 'minus' is for mongo
    const dec_balance_callback = (err, data) => done(err, data || params);
    _inc_balance(ctx, dec_balance_params, dec_balance_callback);
}

function _inc_balance(ctx, params, done) {
    ctx.db.accounts
        .findAndModify(
            { '_id': new ctx.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    balance: ctx.driver.Decimal128.fromString(params.amount)
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true }, // return updated doc
            done);
}
