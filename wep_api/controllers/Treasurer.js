module.exports = {
    balance,
    deposit,
    withdraw
};

async function balance(req, res) {
    const Treasurer = req.ctx.Treasurer;
    const ctx = req.ctx.treasurer_ctx;

    const params = {
        op_id: req.op_id,
        account_id: req.swagger.params.account_id.value
    };
    const account = await Treasurer.balance(ctx, params);
    const response = _compose_response(account);
    return res.json(response);
}

async function deposit(req, res) {
    const Treasurer = req.ctx.Treasurer,
        ctx = req.ctx.treasurer_ctx,
        body = req.swagger.params.body.value;

    const params = {
        op_id: req.op_id,
        account_id: body.account_id,
        incoming: body.incoming,
    };
    const account = await Treasurer.deposit(ctx, params);
    const response = _compose_response(account);
    return res.json(response);
}

async function withdraw(req, res) {
    const Treasurer = req.ctx.Treasurer,
        ctx = req.ctx.treasurer_ctx,
        body = req.swagger.params.body.value;

    const params = {
        op_id: req.op_id,
        account_id: body.account_id,
        outgoing: body.outgoing,
    };
    const account = await Treasurer.withdraw(ctx, params);
    const response = _compose_response(account);
    return res.json(response);
};

/**
 * @private
 */
function _compose_response(account) {
    return Object.freeze({
        account_brief: {
            id: account._id,
            balance: parseFloat(account.balance.toString())
        }
    });
}
