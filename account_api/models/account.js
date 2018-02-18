/**
 * Account's domain model
 * Account stores users' balance and keeps it above threshold
 * @module account
 */

module.exports = account_factory;

/**
 * Account factory
 * @param {object} ctx Params for injection
 * @returns {object} armed module
 */
function account_factory(ctx) {
    let db;

    if (!ctx || !ctx.db) {
        throw new Error('ctx.db is required');
    }

    db = ctx.db;

    return {
        balance: balance,
        deposit: deposit,
        withdraw: withdraw,
        transfer: transfer
    };

    /**
     * Get balance
     * @param {object} params
     * @param {function} done Callback
     */
    function balance(params, done) {
        return db.get_balance(params, done);
    }

    /**
     * Store funds
     * @param {object} params
     * @param {function} done Callback
     */
    function deposit(params, done) {
        return db.inc_balance(params, done);
    }

    /**
     * Spend funds
     * @param {object} params
     * @param {function} done Callback
     */
    function withdraw(params, done) {
        return db.dec_balance(params, done);
    }

    /**
     * Move funds to another account
     * @param {object} params
     * @param {function} done Callback
     */
    function transfer(params, done) {
        return db.get_balance(params, acc_from => {
            // check
            db.dec_balance(params, acc_from_dec => {
                db.inc_balance(params, (err, data => {
                    // refund on fail
                    done(err, data);
                }));
            });
        });
    }
}