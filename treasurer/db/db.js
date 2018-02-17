module.exports = {
    get_amount: get_amount,
    inc_amount: inc_amount,
    dec_amount: dec_amount
};

/**
 * Get balance
 * 
 * @param {object} ctx Context, everything needed
 * @param {object} params
 * @param {function} callback 
 */
function get_amount(ctx, params, callback) {
    ctx.collection
        .findOne(
            new ctx.driver.ObjectID(params.account_id),
            (err, acc) => {
                return callback(err, acc.amount);
            });
}

/**
 * Increase balance
 * 
 * @param {object} ctx Context, everything needed
 * @param {object} params
 * @param {function} callback 
 */
function inc_amount(ctx, params, callback) {
    ctx.collection
        .findAndModify(
            { '_id': new ctx.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    amount: ctx.driver.Decimal128.fromString(params.refill)
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true },
            callback);
}

/**
 * Decrease balance
 * 
 * @param {object} ctx Context, everything needed
 * @param {object} params
 * @param {function} callback 
 */
function dec_amount(ctx, params, callback) {
    ctx.collection
        .findAndModify(
            { '_id': new ctx.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    amount: ctx.driver.Decimal128.fromString('-' + params.spending) // dirty minus
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true },
            callback);
}