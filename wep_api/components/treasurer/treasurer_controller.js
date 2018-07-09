const { map, partialRight, pipeP } = require('ramda')
const currency_codes = require('currency-codes')

module.exports = {
    balance, deposit, withdraw, transfer
}

async function balance({ Treasurer }, req, res) {
    const params = {
        account_id: req.params.account_id.value
    }
    params.op_id = req.params.op_id
    const get_response_json = pipeP(Treasurer.balance, to_account_brief, res.json)
    return get_response_json(params)
}

async function deposit({ Treasurer }, req, res) {
    const get_response_json = pipeP(Treasurer.deposit, to_account_brief, res.json)
    return get_response_json(req.params)
}

async function withdraw({ Treasurer }, req, res) {
    const get_response_json = pipeP(Treasurer.withdraw, to_account_brief, res.json)
    return get_response_json(req.params)
}

async function transfer({ Treasurer }, req, res) {
    const get_response_json = pipeP(Treasurer.transfer, map(to_account_brief), res.json)
    return get_response_json(req.params)
}

/**
 * @private
*/
const _to_account_brief = (account, currency_codes) => ({
    account_brief: {
        id: account._id,
        balance: parseFloat(account.balance.toString()),
        currency: currency_codes.number(account.currency_code).code
    }
})
const to_account_brief = partialRight(_to_account_brief, [currency_codes])
