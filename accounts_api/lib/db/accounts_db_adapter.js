/**
 * Account's DB Adapter
 * @module accounts_db_adapter
*/

module.exports = {
    init,
    get_balance,
    inc_balance,
    dec_balance
};

/**
* Connects to db
* @param {object} ctx           Injected params
* @param {object} ctx.driver
* @param {object} opts          Connection options
* @returns {promise}
*/
function init(ctx, opts) {
    return ctx.driver
        .MongoClient.connect(opts.mongo_url)
        .then(conn => {
            const db = conn.db(opts.db_name);
            const accounts = db.collection(opts.collection_name);

            console.log('Connected successfully to server');
            return accounts;
        })
        // .then(() => {
        //     const account123 = {
        //         balance: ctx.driver.Decimal128.fromString('125.125'),
        //         threshold: ctx.driver.Decimal128.fromString('0.125'),
        //         state: 'active',
        //         deleted: false,
        //         created_at: new Date(),
        //         updated_at: new Date()
        //     };
        //     ctx.accounts.insertOne(account123);
        // })
        .catch(err => console.error('error', err));
}

/**
 * Gets balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts
 * @param {object} ctx.db.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function get_balance(ctx, params, done) {
    ctx.db.accounts
        .findOne(
            new ctx.driver.ObjectID(params.account_id),
            (err, account) => {
                if (!account) return done('nothing found', null);
                return done(err, account);
            });
}

/**
 * Increases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts
 * @param {object} ctx.db.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function inc_balance(ctx, params, done) {
    ctx.db.accounts
        .findAndModify(
            { '_id': new ctx.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    balance: ctx.driver.Decimal128.fromString(params.incoming)
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true }, // return updated doc
            done);
}

/**
 * Decreases balance
 * @param {object} ctx              Injected params
 * @param {object} ctx.db.accounts
 * @param {object} ctx.db.driver
 * @param {object} params
 * @param {function} done           Callback
 */
function dec_balance(ctx, params, done) {
    ctx.db.accounts
        .findAndModify(
            { '_id': new ctx.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    balance: ctx.driver.Decimal128.fromString('-' + params.outgoing) // dirty minus
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true }, // return updated doc
            done);
}
