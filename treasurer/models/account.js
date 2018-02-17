module.exports = {
    balance: balance,
    deposit: deposit,
    withdraw: withdraw,
    transfer: transfer
};

/**
 * Get funds
 * 
 * @param {object} ctx Context, everything needed
 * @param {object} params
 * @param {function} callback 
 */
function balance(ctx, params, callback) {
    ctx.db.get_amount(ctx, params, callback);
}

/**
 * Store funds
 * 
 * @param {object} ctx Context, everything needed
 * @param {object} params
 * @param {function} callback 
 */
function deposit(ctx, params, callback) {
    ctx.db.inc_amount(ctx, params, callback);
}

/**
 * Spend funds
 * 
 * @param {object} ctx Context, everything needed
 * @param {object} params
 * @param {function} callback 
 */
function withdraw(ctx, params, callback) {
    ctx.db.dec_amount(ctx, params, callback);
}

/**
 * Move funds to another account
 * 
 * @param {object} ctx Context, everything needed
 * @param {object} params
 * @param {function} callback 
 */
function transfer(ctx, callback) {
    ctx.db.get_balance(ctx.account_id, acc_from => {
        ctx.db.dec_balance(ctx.account_id, acc_from_dec => {
            ctx.db.inc_balance(ctx.account_id, acc_to_inc => {
                return callback(null, { a: 0.4 });
            });
        });
    });
}