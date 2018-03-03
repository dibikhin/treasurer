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
        })
        // .then(() => {
        //     const account123 = {
        //         balance: this.driver.Decimal128.fromString('125.125'),
        //         threshold: this.driver.Decimal128.fromString('0.125'),
        //         state: 'active',
        //         deleted: false,
        //         created_at: new Date(),
        //         updated_at: new Date()
        //     };
        //     this.accounts.insertOne(account123);
        // })
        .catch(err => console.error('error', err));
}

/**
 * Gets balance
 * @param {object} params
 * @param {function} done Callback
 */
function get_balance(params, done) {
    this.accounts
        .findOne(
            new this.driver.ObjectID(params.account_id),
            (err, account) => {
                if (!account) return done('nothing found', null);
                return done(err, account);
            });
}

/**
 * Increases balance
 * @param {object} params
 * @param {function} done Callback
 */
function inc_balance(params, done) {
    this.accounts
        .findAndModify(
            { '_id': new this.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    balance: this.driver.Decimal128.fromString(params.incoming)
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
    this.accounts
        .findAndModify(
            { '_id': new this.driver.ObjectID(params.account_id) },
            [],
            {
                $inc: {
                    balance: this.driver.Decimal128.fromString('-' + params.outgoing) // dirty minus
                },
                $currentDate: {
                    updated_at: true
                }
            },
            { new: true }, // return updated doc
            done);
}
