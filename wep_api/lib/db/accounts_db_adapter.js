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
 * @param {object} ctx.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 */
async function get_balance({ driver, accounts }, { account_id }) {
    const account_mongo_id = new driver.ObjectID(account_id);
    return await accounts.findOne({ _id: account_mongo_id });
}

/**
 * Increases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 */
async function inc_balance(ctx, { account_id, incoming }) {
    const inc_balance_params = {
        account_id: account_id,
        amount: incoming
    };
    return await _inc_balance(ctx, inc_balance_params);
}

/**
 * Decreases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 */
async function dec_balance(ctx, { account_id, outgoing }) {
    const dec_balance_params = {
        account_id: account_id,
        amount: - outgoing // 'minus' is for mongo
    };
    return await _inc_balance(ctx, dec_balance_params);
}

async function _inc_balance({ accounts, driver }, params) {
    const data = await accounts
        .findAndModify(
            { '_id': new driver.ObjectID(params.account_id) },
            [], {
                $inc: {
                    balance: driver.Decimal128.fromString(params.amount + '')
                },
                $currentDate: {
                    updated_at: true
                }
            }, { new: true }); // return updated doc
    return data.value;
}
