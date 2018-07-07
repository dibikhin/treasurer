/**
 * Treasurer DB adapter
 * @module Treasurer_dal
*/

module.exports = {
    get_balance, inc_balance, dec_balance
}

/**
 * Gets balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.accounts  Collection
 * @param {object} ctx.driver
 */
async function get_balance({ driver, accounts }, { account_id }) {
    const account_mongo_id = new driver.ObjectID(account_id)
    return accounts.findOne({ _id: account_mongo_id })
}

/**
 * Increases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.accounts  Collection
 * @param {object} ctx.driver
 * @param {object} params
 */
async function inc_balance(ctx, { account_id, incoming: amount }) {
    const inc_balance_params = { account_id, amount }
    return _inc_balance(ctx, inc_balance_params)
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
        account_id, amount: - outgoing // 'minus' is for mongo
    }
    return _inc_balance(ctx, dec_balance_params)
}

/**
 * @private
 *
 * @param {any} { accounts, driver }
 * @param {any} { account_id, amount }
 * @returns {object} account
 */
async function _inc_balance({ accounts, driver }, { account_id, amount }) {
    const { value: account } = await accounts
        .findOneAndUpdate(
            { _id: new driver.ObjectID(account_id) }, {
                $inc: {
                    balance: driver.Decimal128.fromString(amount + '')
                },
                $currentDate: {
                    updated_at: true
                }
            }, { returnNewDocument: true })
    return account
}
