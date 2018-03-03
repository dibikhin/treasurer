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
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {function}    done                Callback
 */
function balance(params, done) {
    this.db.get_balance(params,
        (err, account) => {
            return done(err, {
                value: account // due to other functions
            });
        });
}

/**
 * Stores funds
 * @param {object} params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.incoming     Decimal amount to store as string
 * @param {function}    done                Callback
 */
function deposit(params, done) {
    return this.db.inc_balance(params, done);
}

/**
 * Spends funds
 * @param {object}      params
 * @param {ObjectID}    params.account_id
 * @param {string}      params.outgoing     Decimal amount to spend as string
 * @param {function}    done                Callback
 */
function withdraw(params, done) {
    return this.db.dec_balance(params, done);
}

/**
 * Moves funds to another account
 * @param {object}      params
 * @param {ObjectID}    params.from     Sender's account id
 * @param {ObjectID}    params.to       Reciever's account id
 * @param {string}      params.tranche  Decimal amount to transfer as string
 * @param {function}    done            Callback
 */
function transfer(params, done) {
    const params_from = {
        account_id: params.from,
        outgoing: params.tranche
    };
    const params_to = {
        account_id: params.to,
        incoming: params.tranche
    };

    this.db.get_balance(params_from, (err, acc_from) => {
        // check no err
        // check acc_from.value.balance > treshold
        this.db.dec_balance(params_from, (err, acc_from_after_withdraw) => {
            // if (err) return done(err, null);
            this.db.inc_balance(params_to, (err, acc_to_after_deposit) => {
                if (err) console.error(err);
                // deposit(params_from, (err, acc_from_after_deposit => {
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
