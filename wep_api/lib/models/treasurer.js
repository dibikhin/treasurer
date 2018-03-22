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
 * @param {function}    done                Callback
 */
function balance(ctx, params, done) {
    ctx.db_adapter.get_balance(ctx, params, done);
}

/**
 * Stores funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.db_adapter
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.incoming     Decimal amount to store as string
 * @param {function}    done                Callback
 */
function deposit(ctx, params, done) {
    return ctx.db_adapter.inc_balance(ctx, params, done);
}

/**
 * Spends funds
 * @param {object}      ctx                 Injected params
 * @param {object}      ctx.db_adapter
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.outgoing     Decimal amount to spend as string
 * @param {function}    done                Callback
 */
function withdraw(ctx, params, done) {
    const withdraw_get_balance_callback = (err, data) => {
        if (err) {
            return done(err, params);
        }
        const payable_params = {
            account: data.value,
            outgoing: params.outgoing
        };
        if (!ctx.is_payable(payable_params)) {
            return done(new Error('insufficient funds'), params);
        }
        const withdraw_dec_balance_callback = (err, data) => done(err, data || params);
        return ctx.db_adapter.dec_balance(ctx, params, withdraw_dec_balance_callback);
    };
    balance(ctx, params, withdraw_get_balance_callback);
}

/**
 * Moves funds to another account
 * @param {object}      ctx             Injected params
 * @param {object}      params
 * @param {ObjectID}    params.from     Sender's account id
 * @param {ObjectID}    params.to       Reciever's account id
 * @param {string}      params.tranche  Decimal amount to transfer as string
 * @param {function}    done            Callback
 */
function transfer(ctx, params, done) {
    const params_from = {
        account_id: params.from,
        outgoing: params.tranche
    };
    const params_to = {
        account_id: params.to,
        incoming: params.tranche
    };

    withdraw(ctx, params_from, (err, acc_from_after_withdraw) => {
        if (err) { return done(err, params); }
        deposit(ctx, params_to, (err, acc_to_after_deposit) => {
            if (err) { return done(err, params); }

            // TODO try to refund if deposit failed, transaction (begin|commit|rollback)

            return done(null, {
                from: acc_from_after_withdraw,
                to: acc_to_after_deposit
            });
        });
    });
}
