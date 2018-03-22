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
    const get_collection = connection => {
        const accounts = connection.db(opts.db_name).collection(opts.collection_name);
        // TODO use logger
        console.log('Connected successfully to server');
        return accounts;
    };
    return ctx.driver.MongoClient
        .connect(opts.mongo_url)
        .then(get_collection)
        .catch(err => console.error('error', err)); // TODO use logger
}