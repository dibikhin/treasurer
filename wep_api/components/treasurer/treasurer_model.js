/**
 * Treasurer
 * Stores users' balance, moves it and keeps it above threshold
 * @module treasurer
 */

module.exports = {
    balance, deposit, withdraw, transfer
}

/**
 * Gets balance
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.Dal
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.op_id        Correlation Id
 */
async function balance({ Dal }, params) {
    return await Dal.get_balance(params)
}

/**
 * Stores funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.Dal
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.incoming     Decimal amount to store as string
 */
async function deposit({ Dal }, params) {
    return await Dal.inc_balance(params)
}

/**
 * Spends funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.Dal
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.outgoing     Decimal amount to spend as string
 */
async function withdraw({ Dal, Model, is_payable }, { op_id, account_id, outgoing }) {
    const account = await Model.balance({ op_id, account_id })

    const threshold_params = { account }
    if (!is_payable(threshold_params)) {
        throw new Error('insufficient funds') // TODO -> configs
    }
    return await Dal.dec_balance({ op_id, account_id, outgoing })
}

/**
 * Moves funds to another account
 * @param {object}      ctx             Injected params
 * @param {object}      params
 * @param {ObjectID}    params.from     Sender's account id
 * @param {ObjectID}    params.to       Reciever's account id
 * @param {string}      params.tranche  Decimal amount to transfer as string
 */
async function transfer({ Model }, { from, to, tranche }) {
    const params_from = {
        account_id: from, outgoing: tranche
    }
    const params_to = {
        account_id: to, incoming: tranche
    }
    const acc_from_after_withdraw = await Model.withdraw(params_from)
    const acc_to_after_deposit = await Model.deposit(params_to)
    return {
        from: acc_from_after_withdraw,
        to: acc_to_after_deposit
    }
}
