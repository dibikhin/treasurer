/**
 * Treasurer
 * Stores users' balance, moves it and keeps it above threshold
 * @module treasurer
 */

module.exports = {
    balance,
    deposit,
    withdraw,
    transfer
};

/**
 * Gets balance
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.db_adapter
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.op_id        Correlation Id
 */
async function balance(ctx, params) {
    return await ctx.db_adapter.get_balance(ctx, params);
}

/**
 * Stores funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.db_adapter
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.incoming     Decimal amount to store as string
 */
async function deposit(ctx, params) {
    return await ctx.db_adapter.inc_balance(ctx, params);
}

/**
 * Spends funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.db_adapter
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.outgoing     Decimal amount to spend as string
 */
async function withdraw(ctx, params) {
    const data = await balance(ctx, params);
    const payable_params = {
        account: data.value,
        outgoing: params.outgoing
    };
    if (!ctx.is_payable(payable_params)) {
        throw new Error('insufficient funds');
    }
    return await ctx.db_adapter.dec_balance(ctx, params);
}

/**
 * Moves funds to another account
 * @param {object}      ctx             Injected params
 * @param {object}      params
 * @param {ObjectID}    params.from     Sender's account id
 * @param {ObjectID}    params.to       Reciever's account id
 * @param {string}      params.tranche  Decimal amount to transfer as string
 */
async function transfer(ctx, params) {
    const params_from = {
        account_id: params.from,
        outgoing: params.tranche
    };
    const params_to = {
        account_id: params.to,
        incoming: params.tranche
    };

    const acc_from_after_withdraw = await withdraw(ctx, params_from);
    const acc_to_after_deposit = await deposit(ctx, params_to);

    // TODO handle withdraw or deposit fail

    return {
        from: acc_from_after_withdraw,
        to: acc_to_after_deposit
    };
}
