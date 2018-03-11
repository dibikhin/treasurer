module.exports = {
    init
};

/**
* Connects to db
* @param    {object} ctx           Injected params
* @param    {object} ctx.driver
* @param    {object} opts          Connection options
* @returns  {promise}
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