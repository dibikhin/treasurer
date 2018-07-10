const { map, partialRight, pipeP } = require('ramda')
const currency_codes = require('currency-codes')

module.exports = {
    balance, deposit, withdraw, transfer
}

async function balance({ Model }, req, res) {
    return pipeP(
        Model.balance, to_account_brief, res.json
    )(_to_params(req.params))
}

async function deposit({ Model }, req, res) {
    return pipeP(
        Model.deposit, to_account_brief, res.json
    )(req.params)
}

async function withdraw({ Model }, req, res) {
    return pipeP(
        Model.withdraw, to_account_brief, res.json
    )(req.params)
}

async function transfer({ Model }, req, res) {
    return pipeP(
        Model.transfer, map(to_account_brief), res.json
    )(req.params)
}

/**
 * @private
*/
const _to_account_brief = (account, currency_codes) => ({
    account_brief: {
        id: account._id, // TODO _id -> id
        balance: parseFloat(account.balance.toString()),
        currency: currency_codes.number(account.currency_code).code
    }
})
const to_account_brief = partialRight(_to_account_brief, [currency_codes])

const _to_params = (req_params) => ({
    account_id: req_params.account_id.value,
    op_id: req_params.op_id
})
