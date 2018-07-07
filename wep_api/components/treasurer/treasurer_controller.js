const { map, pipeP } = require('ramda');

module.exports = {
    balance, deposit, withdraw, transfer
};

async function balance({ Treasurer }, req, res) {
    const params = {
        account_id: req.params.account_id.value
    };
    params.op_id = req.op_id;
    const get_response_json = pipeP(Treasurer.balance, _to_account_brief, res.json);
    return get_response_json(params);
}

async function deposit({ Treasurer }, req, res) {
    req.params.op_id = req.op_id;
    const get_response_json = pipeP(Treasurer.deposit, _to_account_brief, res.json);
    return get_response_json(req.params);
}

async function withdraw({ Treasurer }, req, res) {
    req.params.op_id = req.op_id;
    const get_response_json = pipeP(Treasurer.withdraw, _to_account_brief, res.json);
    return get_response_json(req.params);
}

async function transfer({ Treasurer }, req, res) {
    req.params.op_id = req.op_id;
    const get_response_json = pipeP(Treasurer.transfer, map, _to_account_brief, res.json);
    return get_response_json(req.params);
}

/**
 * @private
 */
function _to_account_brief(account) {
    return {
        id: account._id, // TODO _id -> id
        balance: parseFloat(account.balance.toString())
    };
}

// timestamp: new Date().toISOString(), // TODO move to headers