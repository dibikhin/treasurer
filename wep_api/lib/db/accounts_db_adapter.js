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
 */
async function get_balance(ctx, params) {
    const account_mongo_id = new ctx.driver.ObjectID(params.account_id);
    const account = await ctx.db.accounts.findOne({ _id: account_mongo_id });
    return { value: account }; // is for common result with db.collection.findAndModify()
}

/**
 * Increases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 */
async function inc_balance(ctx, params) {
    const inc_balance_params = {
        account_id: params.account_id,
        amount: params.incoming
    };
    return await _inc_balance(ctx, inc_balance_params);
}

/**
 * Decreases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 */
async function dec_balance(ctx, params) {
    const dec_balance_params = {
        account_id: params.account_id,
        amount: '-' + params.outgoing // 'minus' is for mongo
    };
    return await _inc_balance(ctx, dec_balance_params);
}

async function _inc_balance(ctx, params) {
    return await ctx.db.accounts
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
            { new: true }); // return updated doc
}
