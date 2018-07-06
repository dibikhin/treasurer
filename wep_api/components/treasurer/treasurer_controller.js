const { pipeP } = require('ramda')

module.exports = {
    balance, deposit, withdraw
}

async function balance({ Treasurer }, req, res) {
    const params = {
        account_id: req.params.account_id.value
    }
    params.op_id = req.op_id
    const get_response_json = pipeP(Treasurer.balance, _compose_response, res.json)
    return get_response_json(params)
}

async function deposit({ Treasurer }, req, res) {
    req.params.op_id = req.op_id
    const get_response_json = pipeP(Treasurer.deposit, _compose_response, res.json)
    return get_response_json(req.params)
}

async function withdraw({ Treasurer }, req, res) {
    req.params.op_id = req.op_id
    const get_response_json = pipeP(Treasurer.withdraw, _compose_response, res.json)
    return get_response_json(req.params)
}

/**
 * @private
 */
function _compose_response(account) {
    return {
        timestamp: new Date().toISOString(), // TODO move to headers
        account_brief: {
            id: account._id, // TODO _id -> id
            balance: parseFloat(account.balance.toString())
        }
    }
}
