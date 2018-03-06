/**
 * Account's domain model
 * Account stores users' balance and keeps it above threshold
 * @module accounts_model
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
 * @param {function}    done                Callback
 */
function balance(ctx, params, done) {
    ctx.db_adapter.get_balance(ctx, params,
        (err, account) => {
            return done(err, {
                value: account // due to other functions
            });
        });
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
    return ctx.db_adapter.dec_balance(ctx, params, done);
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

    balance(ctx, params_from, (err, acc_from) => {
        // check no err
        // check acc_from.value.balance > treshold
        withdraw(ctx, params_from, (err, acc_from_after_withdraw) => {
            // if (err) return done(err, null);
            deposit(ctx, params_to, (err, acc_to_after_deposit) => {
                if (err) console.error(err);
                // deposit(ctx, params_from, (err, acc_from_after_deposit => {
                //     return done(err, acc_from_after_deposit); ?
                // }));

                return done(err, {
                    from: acc_from_after_withdraw,
                    to: acc_to_after_deposit
                });
            });
        });
    });
}
