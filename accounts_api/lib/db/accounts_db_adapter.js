/**
 * Account's DB Adapter
 * @module accounts_db_adapter
*/

module.exports = {
    init: init,
    get_balance: get_balance,
    inc_balance: inc_balance,
    dec_balance: dec_balance
};

/**
* Connects to db
* @param {object} opts Connection options
* @returns {promise}
*/
function init(opts) {
    if (!opts) {
        throw new Error('opts is required');
    }

    return this.driver
        .MongoClient.connect(opts.mongo_url)
        .then(conn => {
            const db = conn.db(opts.db_name);
            this.accounts = db.collection(opts.collection_name);

            console.log('Connected successfully to server');

            // const account123 = {
            //   amount: this.driver.Decimal128.fromString('125.125'),
            //   threshold: this.driver.Decimal128.fromString('0.125'),
            //   state: 'active',
            //   deleted: false,
            //   created_at: new Date(),
            //   updated_at: null
            // };
            // accounts.insertOne(account123);
        })
        .catch(err => console.error('error', err));
}

/**
 * Gets balance
 * @param {object} params
 * @param {function} done Callback
 */
function get_balance(params, done) {
    return this.accounts
        .findOne(
            new this.driver.ObjectID(params.account_id),
            (err, acc) => {
                return done(err, acc.amount);
            });
}

/**
 * Increases balance
 * @param {object} params
 * @param {function} done Callback
 */
function inc_balance(params, done) {
    return this.accounts
        .findAndModify(
            { '_id': new this.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    amount: this.driver.Decimal128.fromString(params.refill)
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
 * @param {object} params
 * @param {function} done Callback
 */
function dec_balance(params, done) {
    return this.accounts
        .findAndModify(
            { '_id': new this.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    amount: this.driver.Decimal128.fromString('-' + params.spending) // dirty minus
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true }, // return updated doc
            done);
}
