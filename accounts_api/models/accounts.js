/**
 * Account's domain model
 * Account stores users' balance and keeps it above threshold
 * @module accounts_model
 */

module.exports = {
    balance: balance,
    deposit: deposit,
    withdraw: withdraw,
    transfer: transfer
};

/**
 * Gets balance
 * @param {object} params
 * @param {function} done Callback
 */
function balance(params, done) {
    return this.db.get_balance(params, done);
}

/**
 * Stores funds
 * @param {object} params
 * @param {function} done Callback
 */
function deposit(params, done) {
    return this.db.inc_balance(params, done);
}

/**
 * Spends funds
 * @param {object} params
 * @param {function} done Callback
 */
function withdraw(params, done) {
    return this.db.dec_balance(params, done);
}

/**
 * Moves funds to another account
 * @param {object} params
 * @param {function} done Callback
 */
function transfer(params, done) {
    return this.db.get_balance(params, acc_from => {
        // check
        this.db.dec_balance(params, acc_from_dec => {
            this.db.inc_balance(params, (err, data => {
                // refund on fail
                done(err, data);
            }));
        });
    });
}
