/**
 * Account Provider
 * @module account_db
*/

module.exports = account_db_factory;

/**
 * Account DB factory
 * @param {object} ctx Params for injection
 */
function account_db_factory(ctx) {
    let driver,
        accounts;

    if (!ctx || !ctx.driver) {
        throw new Error('ctx.driver is required');
    }

    driver = ctx.driver;

    return {
        init: init,
        get_balance: get_balance,
        inc_balance: inc_balance,
        dec_balance: dec_balance
    };

    /**
     * Connect to db
     * @param {object} opts Connection options
     * @returns {promise}
     */
    function init(opts) {
        if (!opts) {
            throw new Error('opts is required');
        }

        return driver
            .MongoClient.connect(opts.mongo_url)
            .then(conn => {
                const db = conn.db(opts.db_name);
                accounts = db.collection(opts.collection_name);

                console.log('Connected successfully to server');

                // const account123 = {
                //   amount: driver.Decimal128.fromString('125.125'),
                //   threshold: driver.Decimal128.fromString('0.125'),
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
     * Get balance
     * @param {object} params
     * @param {function} done Callback
     */
    function get_balance(params, done) {
        return accounts
            .findOne(
                new driver.ObjectID(params.account_id),
                (err, acc) => {
                    return done(err, acc.amount);
                });
    }

    /**
     * Increase balance
     * @param {object} params
     * @param {function} done Callback
     */
    function inc_balance(params, done) {
        return accounts
            .findAndModify(
                { '_id': new driver.ObjectID(params.account_id) },
                [],
                {
                    $inc: {
                        amount: driver.Decimal128.fromString(params.refill)
                    },
                    $currentDate: {
                        updated_at: true
                    }
                },
                { new: true }, // return updated doc
                done);
    }

    /**
     * Decrease balance
     * @param {object} params
     * @param {function} done Callback
     */
    function dec_balance(params, done) {
        return accounts
            .findAndModify(
                { '_id': new driver.ObjectID(params.account_id) },
                [],
                {
                    $inc: {
                        amount: driver.Decimal128.fromString('-' + params.spending) // dirty minus
                    },
                    $currentDate: {
                        updated_at: true
                    }
                },
                { new: true },
                done);
    }
}
