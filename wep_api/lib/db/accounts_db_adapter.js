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
    const get_balance_callback = (err, account) => {
        // if (!account) return done('nothing found', null);
        // return done(err, account);
        return done('bla bla err', null);
    };
    ctx.db.accounts.findOne(new ctx.driver.ObjectID(params.account_id), get_balance_callback);
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
    _inc_balance(ctx, inc_balance_params, done);
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
    const dec_balance_params = { account_id: params.account_id, amount: '-' + params.outgoing }; //minus is for mongo
    _inc_balance(ctx, dec_balance_params, done);
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
