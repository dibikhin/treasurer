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
async function balance({ Dal, Errors }, params) {
    return await Dal.get_balance(params) || Errors.account_not_found_error(params.account_id)
}

/**
 * Stores funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.Dal
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.incoming     Decimal amount to store as string
 */
async function deposit({ Dal, Errors }, params) {
    return await Dal.inc_balance(params) || Errors.account_not_found_error(params.account_id)
}

/**
 * Spends funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.Dal
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.outgoing     Decimal amount to spend as string
 */
async function withdraw({ Dal, Model, Rules, Errors }, { op_id, account_id, outgoing }) {
    const account = await Model.balance({ op_id, account_id })
    Rules.is_account_payable({ account, outgoing }) || Errors.insufficient_funds_error(account_id)
    return await Dal.dec_balance({ op_id, account_id, outgoing }) || Errors.account_not_found_error(account_id)
}

/**
 * Moves funds to another account
 * @param {object}      ctx             Injected params
 * @param {object}      params
 * @param {ObjectID}    params.from     Sender's account id Creditor
 * @param {ObjectID}    params.to       Reciever's account id TODO Debitor
 * @param {string}      params.tranche  Decimal amount to transfer as string
 */
async function transfer({ Model, Rules, Errors }, { op_id, from, to, tranche }) {
    Rules.is_transfer_parties_differ({ from, to }) || Errors.self_transfer_forbidden_error() // TODO ++ from, to ?

    const params_from = {
        op_id, account_id: from, outgoing: tranche
    }
    const params_to = {
        op_id, account_id: to, incoming: tranche
    }
    return {
        from: await Model.withdraw(params_from),
        to: await Model.deposit(params_to)
    }
}
