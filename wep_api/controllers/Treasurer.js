module.exports.balance = async function balance(req, res) {
    const op_id = req.ctx.op_id();
    const params = {
        op_id,
        account_id: req.swagger.params.account_id.value
    };
    const account = await req.ctx.Treasurer.balance(req.ctx.treasurer_ctx, params);
    
    const resp = {
        op_id,
        account_brief: {
            id: account.value._id, // TODO add earlier _id -> id
            balance: account.value.balance.toString()
        }
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resp, null, 2));
};

module.exports.deposit = function deposit(req, res) {
    Treasurer.deposit(req.swagger.params, res);
};

module.exports.withdraw = function withdraw(req, res) {
    Treasurer.withdraw(req.swagger.params, res);
};

// req.ctx.log(req.swagger.params);
